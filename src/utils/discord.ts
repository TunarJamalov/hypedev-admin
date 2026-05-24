export async function sendDiscordNotification(title: string, message: string, color: number = 3447003) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Discord webhook URL is not set');
    return;
  }

  try {
    const payload = {
      embeds: [{
        title,
        description: message,
        color,
        timestamp: new Date().toISOString()
      }]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send Discord notification', error);
  }
}
