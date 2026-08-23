using FluentValidation;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using HasanHabibSeyda.Domain.Entities;
using MediatR;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Commands;

public record CreateReferenceCompanyCommand : IRequest<ReferenceCompanyDto>
{
    public string Name { get; init; } = string.Empty;
    public string LogoUrl { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateReferenceCompanyCommandValidator : AbstractValidator<CreateReferenceCompanyCommand>
{
    public CreateReferenceCompanyCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(160);
        RuleFor(x => x.LogoUrl).NotEmpty().MaximumLength(500);
    }
}

public class CreateReferenceCompanyCommandHandler : IRequestHandler<CreateReferenceCompanyCommand, ReferenceCompanyDto>
{
    private readonly IAppDbContext _db;

    public CreateReferenceCompanyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReferenceCompanyDto> Handle(CreateReferenceCompanyCommand request, CancellationToken ct)
    {
        var entity = new ReferenceCompany
        {
            Name = request.Name.Trim(),
            LogoUrl = request.LogoUrl.Trim(),
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
        };

        _db.ReferenceCompanies.Add(entity);
        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
