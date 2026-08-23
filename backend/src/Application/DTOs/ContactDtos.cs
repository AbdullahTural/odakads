namespace HasanHabibSeyda.Application.DTOs;

/// <summary>Admin panelinde iletisim talebini gostermek icin.</summary>
public class ContactRequestDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public bool IsRead { get; set; }
}

/// <summary>POST /api/contact cevabi (frontend ContactResponseDto ile birebir).</summary>
public class ContactResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
