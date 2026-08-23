namespace HasanHabibSeyda.Infrastructure.Settings;

public class ResendSettings
{
    public const string SectionName = "Resend";

    public string ApiKey { get; set; } = string.Empty;
    public string From { get; set; } = "Odak Ads Reklam <info@odakadsreklam.com>";
    public string To { get; set; } = string.Empty;
}
