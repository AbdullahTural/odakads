using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.Testimonials.Commands;

public record UpdateTestimonialCommand : IRequest<TestimonialDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Company { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
    public int Rating { get; init; }
    public string Content { get; init; } = string.Empty;
    public bool IsFeatured { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateTestimonialCommandValidator : AbstractValidator<UpdateTestimonialCommand>
{
    public UpdateTestimonialCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Role).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Company).NotEmpty().MaximumLength(160);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
    }
}

public class UpdateTestimonialCommandHandler : IRequestHandler<UpdateTestimonialCommand, TestimonialDto>
{
    private readonly IAppDbContext _db;

    public UpdateTestimonialCommandHandler(IAppDbContext db) => _db = db;

    public async Task<TestimonialDto> Handle(UpdateTestimonialCommand request, CancellationToken ct)
    {
        var entity = await _db.Testimonials.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans", request.Id);

        entity.Name = request.Name.Trim();
        entity.Role = request.Role.Trim();
        entity.Company = request.Company.Trim();
        entity.AvatarUrl = request.AvatarUrl;
        entity.Rating = request.Rating;
        entity.Content = request.Content.Trim();
        entity.IsFeatured = request.IsFeatured;
        entity.IsActive = request.IsActive;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
