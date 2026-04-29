import * as fs from "fs";
import * as path from "path";

function getLogoBase64() {
  const possiblePaths = [
    path.join(process.cwd(), "src", "assets", "cfe-logo.png"),
    path.join(process.cwd(), "dist", "src", "assets", "cfe-logo.png"),
    path.join(__dirname, "..", "assets", "cfe-logo.png"),
  ];

  const logoPath = possiblePaths.find((p) => fs.existsSync(p));

  if (!logoPath) return "";

  return `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
}

export function ccPdfTemplate(cc: any) {
  const logoBase64 = getLogoBase64();

  const fecha = new Date(cc.fecha)
    .toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const isDirecto = cc.tipoCC === "DIRECTO";

  const field = (label: string, value?: string | null) => `
    <div class="field-row">
      <div class="label">${label}:</div>
      <div class="value">${value || "----------------------"}</div>
    </div>
  `;

  const imgBlock = (src?: string | null, className = "pdf-img") => {
    if (!src) return "";

    return `
      <div class="${className}">
        <img src="${src}" />
      </div>
    `;
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<style>
  @page {
    size: Letter;
    margin: 1.25cm 1.55cm 1.2cm 1.55cm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
    font-size: 11.5px;
    line-height: 1.24;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-top: 1px solid #bdbdbd;
    padding-top: 7px;
    margin-bottom: 28px;
  }

  .logo {
    width: 110px;
    height: 58px;
    display: flex;
    align-items: flex-start;
  }

  .logo img {
    width: 110px;
    height: auto;
    object-fit: contain;
  }

  .logo-fallback {
    color: #00843d;
    font-size: 38px;
    font-style: italic;
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 1;
  }

  .header-right {
    text-align: right;
    color: #b0b0b0;
    font-weight: bold;
    font-size: 13px;
    line-height: 1.1;
  }

  .fecha {
    text-align: right;
    color: red;
    font-size: 12px;
    margin-bottom: 14px;
  }

  .title {
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 17px;
  }

  .title span {
    color: red;
  }

  .data-block {
    width: 88%;
    margin-bottom: 12px;
  }

  .field-row {
    display: flex;
    min-height: 16px;
  }

  .label {
    width: 108px;
    text-transform: uppercase;
  }

  .value {
    flex: 1;
    text-transform: uppercase;
  }

  .section-title {
    font-weight: bold;
    margin-top: 13px;
    margin-bottom: 4px;
    font-size: 13px;
  }

  .paragraph {
    text-align: justify;
    white-space: pre-line;
    margin-bottom: 10px;
  }

  .photo-img {
    width: 100%;
    text-align: center;
    margin: 8px 0 12px 0;
    page-break-inside: avoid;
  }

  .photo-img img {
    max-width: 82%;
    max-height: 205px;
    object-fit: contain;
  }

  .pdf-img {
    width: 100%;
    text-align: center;
    margin: 10px 0 13px 0;
    page-break-inside: avoid;
  }

  .pdf-img img {
    max-width: 96%;
    max-height: 235px;
    object-fit: contain;
  }

  .power-img {
    width: 100%;
    text-align: center;
    margin: 8px 0 15px 0;
    page-break-inside: avoid;
  }

  .power-img img {
    max-width: 96%;
    max-height: 280px;
    object-fit: contain;
  }

  .signature {
    margin-top: 34px;
    text-align: left;
    page-break-inside: avoid;
  }

  .att {
    letter-spacing: 5px;
    font-style: italic;
    margin-bottom: 55px;
  }

  .firma-nombre,
  .footer-text {
    font-weight: bold;
    color: red;
    font-style: italic;
    text-transform: uppercase;
  }
</style>
</head>

<body>
  <div class="header">
    <div class="logo">
      ${
        logoBase64
          ? `<img src="${logoBase64}" />`
          : `<div class="logo-fallback">CFE</div>`
      }
    </div>

    <div class="header-right">
      <div>División de Distribución Centro Oriente</div>
      <div>Zona de Distribución Matamoros</div>
    </div>
  </div>

  <div class="fecha">${fecha}</div>

  <div class="title">
    MEMORIA TÉCNICA PARA DETERMINAR AJUSTE A LA FACTURACIÓN <span>${cc.numeroMemoria}</span>
  </div>

  <div class="data-block">
    ${field("Nombre", cc.nombre)}
    ${field("Dirección", cc.direccion)}
    ${field("Medidor", cc.medidor)}
    ${field("Tarifa", cc.tarifa)}
    ${field("R.P.U.", cc.rpu)}
    ${field("Geo", cc.geo)}
    ${isDirecto ? field("Agencia", cc.agencia) : ""}
  </div>

  <div class="section-title">Descripción de la anomalía:</div>
  <div class="paragraph">${cc.descripcion || ""}</div>

  <div class="section-title">Tipo de anomalía:</div>
  <div class="paragraph">
${cc.tipoAnomalia || ""}${cc.descripcionAnomalia ? " " + cc.descripcionAnomalia : ""}
  </div>

  ${imgBlock(cc.fotoAnomaliaBase64, "photo-img")}

  <div class="section-title">Tipo de giro:</div>
  <div class="paragraph">${cc.tipoGiro || ""}</div>

  <div class="section-title">Método de cálculo de ajuste:</div>
  <div class="paragraph">${cc.metodoCalculo || ""}</div>

  ${imgBlock(cc.tablaCalculoBase64, "pdf-img")}

  <div class="section-title">Periodo del ajuste:</div>
  <div class="paragraph">${cc.periodoAjuste || ""}</div>

  ${
    !isDirecto
      ? `
        <div class="section-title">Power análisis del servicio:</div>
        ${cc.powerAnalisisTexto ? `<div class="paragraph">${cc.powerAnalisisTexto}</div>` : ""}
        ${imgBlock(cc.powerAnalisisBase64, "power-img")}
      `
      : ""
  }

  <div class="section-title">Situación actual:</div>
  <div class="paragraph">${cc.personaAtiende || ""}</div>

  ${
    cc.ordenSuspension
      ? `<div class="paragraph">Se suspende servicio con orden ${cc.ordenSuspension}.</div>`
      : ""
  }

  <div class="signature">
    <div class="att">A t e n t a m e n t e</div>

    <div class="firma-nombre">${cc.ingenieroNombre}</div>
    <div class="footer-text">${cc.puesto}</div>
    <div class="footer-text">${cc.area}</div>
  </div>
</body>
</html>
`;
}