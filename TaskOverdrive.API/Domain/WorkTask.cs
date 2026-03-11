namespace TaskOverdrive.Domain;

public sealed class WorkTask
{
    public int Id{get; private set;}
    public string Title{get; private set;} = default!;
    public string Description{get; private set;} = string.Empty;

    public int Priority{get; private set;}
    public bool IsCompleted{get; private set;}
    public DateTime CreatedAt{get; private set;}

    private WorkTask(){}


    public static WorkTask Create(string title, string description, int priority)
    {
        if (priority < 1 || priority > 5)
        throw new ArgumentOutOfRangeException(
            nameof(priority),
            $"The Priority must be between 1 and 5. Yours is:  {priority}"
        );

        if (string.IsNullOrWhiteSpace(title))
        throw new ArgumentException("Title cannot be empty", nameof(title));


        return new WorkTask
        {
            Title = title.Trim(),
            Description = description.Trim(),
            Priority = priority,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Complete() => IsCompleted = true;

}