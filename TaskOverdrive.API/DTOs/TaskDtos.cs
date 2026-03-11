namespace TaskOverdrive.Application.DTOs;


public sealed record CreateTaskDto(
    string Title,
    string Description,
    int Priority
);

public sealed record TaskResponseDto(
    int Id,
    string Title,
    string Description,
    int Priority,
    bool IsCompleted,
    DateTime CreatedAt
);