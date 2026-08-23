using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.Services.Commands;

public record CreateServiceCommand : IRequest<ServiceDto>
{
    public string Slug { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Icon { get; init; } = string.Empty;
    public List<string> Features { get; init; } = new();
    public int Order { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateServiceCommandValidator : AbstractValidator<CreateServiceCommand>
{
    public CreateServiceCommandValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Icon).NotEmpty().MaximumLength(60);
    }
}

public class CreateServiceCommandHandler : IRequestHandler<CreateServiceCommand, ServiceDto>
{
    private readonly IAppDbContext _db;

    public CreateServiceCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ServiceDto> Handle(CreateServiceCommand request, CancellationToken ct)
    {
        var entity = new Service
        {
            Slug = request.Slug.Trim(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Icon = request.Icon.Trim(),
            Features = request.Features,
            DisplayOrder = request.Order,
            IsActive = request.IsActive,
        };

        _db.Services.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
