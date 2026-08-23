using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.Testimonials.Commands;

public record CreateTestimonialCommand : IRequest<TestimonialDto>
{
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
    public int Rating { get; init; }
    public string Content { get; init; } = string.Empty;
    public bool IsFeatured { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateTestimonialCommandValidator : AbstractValidator<CreateTestimonialCommand>
{
    public CreateTestimonialCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Role).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Company).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
    }
}

public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, TestimonialDto>
{
    private readonly IAppDbContext _db;

    public CreateTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<TestimonialDto> Handle(CreateTestimonialCommand request, CancellationToken ct)
    {
        var entity = new Testimonial
        {
            Name = request.Name.Trim(),
            Role = request.Role.Trim(),
            Company = request.Company.Trim(),
            AvatarUrl = request.AvatarUrl,
            Rating = request.Rating,
            Content = request.Content.Trim(),
            IsFeatured = request.IsFeatured,
            IsActive = request.IsActive,
        };

        _db.Testimonials.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
