using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using TaskOverdrive.Application.DTOs;
using TaskOverdrive.Domain;
using TaskOverdrive.Infrastructure.Persistance;


namespace TaskOverdrive.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public sealed class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<TasksController> _logger;

    public TasksController(AppDbContext db, ILogger<TasksController> logger)
    {
        _db = db;
        _logger = logger;
    }


[HttpGet]
[ProducesResponseType(typeof(IEnumerable<TaskResponseDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        await Task.Delay(3000, cancellationToken);
    
        var tasks = await _db.WorkTasks.AsNoTracking().OrderByDescending(m => m.Priority).ThenBy(m => m.CreatedAt).Select(m => new TaskResponseDto(m.Id, m.Title, m.Description, m.Priority, m.IsCompleted, m.CreatedAt)).ToListAsync(cancellationToken);
    
    return Ok(tasks);
    }
    
    
[HttpGet("{id:int}")]
[ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status200OK)]   
[ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var task = await _db.WorkTasks.FindAsync(new object[] { id }, cancellationToken);
        if (task is null) return NotFound();

        return Ok(new TaskResponseDto(
            task.Id, task.Title, task.Description,
            task.Priority, task.IsCompleted, task.CreatedAt));
    }   
    
[HttpPost]
    [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(
        [FromBody] CreateTaskDto dto,
        CancellationToken cancellationToken)
    {
        
        WorkTask task;
        try
        {
            task = WorkTask.Create(dto.Title, dto.Description, dto.Priority);
        }
        catch (ArgumentOutOfRangeException ex)
        {
           
            return ValidationProblem(new ValidationProblemDetails
            {
                Title  = "Validation Failed",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest,
                Errors = { ["priority"] = new[] { ex.Message } }
            });
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(new ValidationProblemDetails
            {
                Title  = "Validation Failed",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest,
                Errors = { ["title"] = new[] { ex.Message } }
            });
        }

        _db.WorkTasks.Add(task);

        try
        {
            await _db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is PostgresException pgEx
                  && pgEx.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            
            _logger.LogWarning("Duplicate title attempted: {Title}", dto.Title);

            return Conflict(new ProblemDetails
            {
                Title  = "Duplicate Task",
                Detail = $"A task with the title '{dto.Title}' already exists.",
                Status = StatusCodes.Status409Conflict
            });
        }

        var response = new TaskResponseDto(
            task.Id, task.Title, task.Description,
            task.Priority, task.IsCompleted, task.CreatedAt);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, response);
    }

[HttpDelete("{id:int}")]
[ProducesResponseType(StatusCodes.Status204NoContent)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var task = await _db.WorkTasks.FindAsync(new object[] {id}, cancellationToken);
        if (task is null) return NotFound();

        _db.WorkTasks.Remove(task);
        await _db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }


}