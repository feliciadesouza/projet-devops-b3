/**
 * Origines autorisées pour CORS (séparées par des virgules).
 * En production, Terraform injecte aussi l’URL du site S3.
 */
function corsOrigins() {
  const raw =
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    'http://localhost:3000,http://localhost:3001,http://localhost';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

module.exports = corsOrigins;
