# Política de Privacidad y Tratamiento de Datos — ORUS

> ⚠️ **BORRADOR / PLANTILLA. No es asesoría legal.** Debe ser revisado por un abogado en Colombia
> (Ley 1581 de 2012, Decreto 1377 de 2013, Estatuto del Consumidor Ley 1480 de 2011) y ajustado a
> los requisitos de Apple App Store y Google Play antes de publicarse. Los `[corchetes]` son datos
> por completar. Las líneas `> Nota:` son decisiones para el abogado.

**Última actualización:** [FECHA]
**Responsable del tratamiento:** [RAZÓN SOCIAL / NOMBRE], NIT/CC [___], domicilio [CIUDAD, COLOMBIA].
**Contacto de privacidad (habeas data):** [correo] · [dirección] · [teléfono].

---

## 1. Qué es este documento
Explica qué datos personales recolecta ORUS ("la App"), con qué finalidad, con quién se comparten,
cómo se protegen y qué derechos tienes. Al crear una cuenta y usar la App, **autorizas** este
tratamiento conforme a la Ley 1581 de 2012.

## 2. Datos que recolectamos

**a. Identidad y cuenta.** Nombre, apellido, correo electrónico y (opcional) teléfono. Si inicias
sesión con **Google** o **Apple**, recibimos de ellos tu nombre y correo (Apple puede entregar un
correo enmascarado "Hide My Email").

**b. Datos financieros (sensibles para ti).** Transacciones, montos, saldos, categorías,
presupuestos y "Workspaces" (finanzas compartidas). *Si compartes un Workspace, tratarás datos de
otras personas: eres responsable de contar con su autorización.*

**c. Notificaciones y mensajes (función de lectura automática).** Con tu **autorización expresa**,
la App puede leer el **contenido de notificaciones** (p. ej. de tu banco, Google Pay o Apple Pay) y/o
**mensajes SMS** para detectar movimientos. *Ver §7 (limitaciones por plataforma).*

**d. Audio (entrada por voz).** Si usas el micrófono para registrar movimientos, procesamos el
audio y/o su transcripción.

**e. Datos técnicos.** Identificador de dispositivo, versión de la App y del sistema, dirección IP,
idioma/moneda, tokens de notificaciones push, y **registros de errores/diagnóstico** (crash logs).

**f. Datos de uso.** Interacciones dentro de la App para mejorar el producto.

**g. Pago/suscripción.** El plan (p. ej. $10.000 COP/mes) se cobra a través de [Apple/Google/pasarela];
**no almacenamos números de tarjeta** — los maneja el procesador de pagos.

> Nota: enumerar exactamente qué datos pide cada permiso, para el "Data Safety" de Google Play y la
> "Privacy Nutrition Label" de Apple (deben coincidir con esta política).

## 3. Para qué usamos tus datos (finalidades)
- Prestar el servicio: registrar y organizar tus finanzas, presupuestos y Workspaces.
- **Inteligencia artificial:** generar informes, recomendaciones, y reconocer patrones, pilares y
  categorías a partir de tus movimientos, notificaciones y/o audio. *Ver §5.*
- Autenticarte y proteger la cuenta.
- Facturar la suscripción.
- Mejorar la App, prevenir fraude y depurar errores.
- Enviarte notificaciones del servicio.

**Base legal:** tu **autorización** (consentimiento), y la ejecución del contrato de servicio.

## 4. Con quién compartimos datos (encargados/sub-encargados)
No vendemos tus datos. Los compartimos con proveedores que los tratan **por cuenta nuestra**:
- **Infraestructura/BD:** [Supabase / proveedor cloud] — almacenamiento y autenticación.
- **IA:** [OpenAI / Anthropic] — para generar informes/recomendaciones y clasificar movimientos.
- **Transcripción de voz:** [proveedor STT], si aplica.
- **Diagnóstico de errores:** [Sentry].
- **Pagos:** [Apple / Google / pasarela].
- **Notificaciones push:** [FCM / APNs].

> Nota: firmar **contratos de transmisión/transmisión de datos** con cada encargado (Decreto 1377).

## 5. Inteligencia Artificial (divulgación)
La App **usa inteligencia artificial** (modelos de terceros) para producir informes, recomendaciones
y clasificaciones. Para ello, **enviamos datos financieros y/o audio/transcripciones** a estos
proveedores, que pueden estar **fuera de Colombia** (p. ej. EE. UU.). Los resultados de la IA
**pueden ser inexactos** y **no constituyen asesoría financiera, tributaria ni legal**. No usamos tu
información para **entrenar** modelos de terceros [confirmar con el proveedor y declararlo].

## 6. Transferencias internacionales
Algunos proveedores están fuera de Colombia. Realizamos la transferencia con base en tu autorización
y en las garantías exigidas por la Ley 1581/Decreto 1377 [cláusulas contractuales/otras].

## 7. Permisos por plataforma (importante)
- **Android:** la lectura de **notificaciones** usa un permiso especial de "acceso a notificaciones";
  la lectura de **SMS** está **muy restringida** por las políticas de Google Play. Solo se solicitan
  con tu autorización y con una **divulgación destacada** previa.
- **iOS (Apple):** el sistema **no permite** que la App lea SMS ni notificaciones de otras apps. En
  iOS, el registro puede ser manual, por voz, o mediante conexión bancaria [si se integra un
  agregador]. 

> Nota: esto es una realidad técnica/de tienda, no solo legal — verificar el flujo por plataforma.

## 8. Menores de edad
La App **no está dirigida a menores de 18 años** y no recolectamos datos de menores a sabiendas.

## 9. Seguridad
Aplicamos medidas razonables: cifrado en tránsito (TLS) y en reposo, aislamiento por usuario
(RLS), control de acceso y mínimo privilegio. Ningún sistema es 100% infalible.

## 10. Retención
Conservamos tus datos mientras tengas cuenta y por el tiempo exigido por la ley. Al eliminar tu
cuenta, borramos o anonimizamos tus datos en un plazo de [X] días, salvo obligación legal de
conservarlos. El **audio** se [descarta tras procesarlo / conserva X].

## 11. Tus derechos (Habeas Data)
Puedes **conocer, actualizar, rectificar y suprimir** tus datos, y **revocar** la autorización,
escribiendo a [correo de privacidad]. También puedes presentar quejas ante la **Superintendencia de
Industria y Comercio (SIC)**. Responderemos en los términos de la Ley 1581.

## 12. Cambios
Podemos actualizar esta política; te avisaremos dentro de la App y publicaremos la fecha de vigencia.

## 13. Contacto
[Razón social] · [correo] · [dirección] · [teléfono].

---
*Documento generado como borrador. Requiere revisión legal profesional antes de su uso.*
