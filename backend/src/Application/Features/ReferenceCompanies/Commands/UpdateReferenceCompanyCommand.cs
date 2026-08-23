using FluentValidation;
using HasanHabibSeyda.Application.Common.Exceptions;
using HasanHabibSeyda.Application.Common.Interfaces;
using HasanHabibSeyda.Application.Common.Mapping;
using HasanHabibSeyda.Application.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HasanHabibSeyda.Application.Features.ReferenceCompanies.Commands;

public record UpdateReferenceCompanyCommand : IRequest<ReferenceCompanyDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string LogoUrl { get; init; } = string.Empty;
    public int DisplayOrder { get; init; }
    public bool IsActive { get; init; } = true;
}

public class UpdateReferenceCompanyCommandValidator : AbstractValidator<UpdateReferenceCompanyCommand>
{
    public UpdateReferenceCompanyCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(160);
        RuleFor(x => x.LogoUrl).NotEmpty().MaximumLength(500);
    }
}

public class UpdateReferenceCompanyCommandHandler : IRequestHandler<UpdateReferenceCompanyCommand, ReferenceCompanyDto>
{
    private readonly IAppDbContext _db;

    public UpdateReferenceCompanyCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReferenceCompanyDto> Handle(UpdateReferenceCompanyCommand request, CancellationToken ct)
    {
        var entity = await _db.ReferenceCompanies.FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new NotFoundException("Referans firma", request.Id);

        entity.Name = request.Name.Trim();
        entity.LogoUrl = request.LogoUrl.Trim();
        entity.DisplayOrder = request.DisplayOrder;
        entity.IsActive = request.IsActive;

        await _db.SaveChangesAsync(ct);
        return entity.ToDto();
    }
}
