(function () {
  var BASE_STORAGE_KEY = "ixmati_academia_progress_v2";
  var STUDENT_INDEX_KEY = "ixmati_academia_students_v1";
  var PASSING_SCORE = 80;
  var ACADEMY_API = window.IxmatiAcademySupabase || null;
  var remoteProgress = null;

  var modules = [
    {
      id: "estudio-visual",
      title: "Estudio Visual",
      href: "modulo-estudio-visual.html",
      time: "3 h",
      level: "Base",
      summary: "Branding, identidad visual, diseno, impresion, vinil, rotulacion y material publicitario.",
      outcome: "Flor podra diagnosticar necesidades visuales y recomendar el servicio correcto.",
      lessons: [
        {
          title: "Branding vs identidad visual",
          objective: "Separar estrategia de marca de ejecucion grafica.",
          concepts: ["Branding define posicionamiento, tono, promesa y percepcion.", "Identidad visual traduce esa estrategia a logo, color, tipografia y reglas.", "Una marca puede tener logo, pero seguir sin branding si no comunica una idea clara."],
          examples: ["Negocio nuevo sin nombre claro: primero branding.", "Negocio con logo viejo y piezas inconsistentes: identidad visual.", "Cliente que solo pide flyer pero no sabe que promocionar: diagnostico antes de disenar."],
          exercise: "Escribe 3 preguntas para saber si el cliente necesita branding o solo identidad visual."
        },
        {
          title: "Diseno grafico aplicado a ventas",
          objective: "Entender el diseno como herramienta comercial, no como decoracion.",
          concepts: ["Cada pieza debe tener objetivo, publico, mensaje y accion.", "El diseno de redes, flyer, menu o lona cambia segun el contexto.", "La jerarquia visual decide que lee primero el cliente."],
          examples: ["Promo de restaurante: platillo, precio, vigencia y WhatsApp.", "Servicio profesional: beneficio, confianza y agenda.", "Tienda: producto, variante, precio y disponibilidad."],
          exercise: "Toma una promocion real y ordena sus datos de mayor a menor importancia."
        },
        {
          title: "Impresion, vinil y rotulacion",
          objective: "Elegir formato fisico segun uso, superficie y duracion.",
          concepts: ["Impresion sirve para material que se entrega, exhibe o reemplaza.", "Vinil funciona sobre cristales, paredes, vehiculos y superficies lisas.", "Rotulacion convierte fachada, auto o modulo en punto de atraccion."],
          examples: ["Apertura: lona temporal + flyers.", "Fachada permanente: rotulacion y vinil.", "Promocion mensual: poster o material de mostrador."],
          exercise: "Clasifica 5 solicitudes de cliente como impresion, vinil o rotulacion."
        },
        {
          title: "Diagnostico visual",
          objective: "Levantar informacion antes de prometer precio o entrega.",
          concepts: ["Pedir medidas, cantidad, material, fecha, ubicacion y archivo disponible.", "Confirmar si requiere diseno, impresion, instalacion o todo el flujo.", "El uso final determina acabado, resistencia y prioridad."],
          examples: ["Vinil en cristal con sol directo requiere considerar durabilidad.", "Menu de restaurante requiere medidas, plastificado y cantidad.", "Logo para redes no es lo mismo que logo para fachada."],
          exercise: "Construye un checklist de datos minimos antes de cotizar."
        }
      ],
      practice: [
        { prompt: "Una tienda manda fotos de su fachada y dice: 'quiero que se vea mas profesional'.", answer: "Diagnosticar identidad visual y rotulacion. Preguntar medidas, ubicacion, giro, logo actual, presupuesto y si requiere instalacion." },
        { prompt: "Un restaurante quiere imprimir menus manana, pero no tiene archivo editable.", answer: "Separar diseno urgente de impresion. Confirmar medidas, numero de paginas, cantidad, acabados y fecha realista." },
        { prompt: "Un negocio pide solo 'un logo bonito' para abrir la proxima semana.", answer: "Explicar branding basico + identidad inicial. Levantar nombre, giro, publico, estilo, aplicaciones y entregables." }
      ],
      questions: [
        { q: "Cuando conviene iniciar por branding?", a: ["Cuando no hay posicionamiento ni mensaje claro", "Cuando solo falta imprimir", "Cuando ya existe manual completo"], correct: 0 },
        { q: "La identidad visual incluye principalmente:", a: ["Logo, colores, tipografias y reglas de uso", "Agenda de citas", "Configuracion de campanas"], correct: 0 },
        { q: "Antes de cotizar vinil se debe confirmar:", a: ["Superficie, medidas, ubicacion y uso", "Solo el nombre del cliente", "La contrasena de redes"], correct: 0 },
        { q: "Un flyer efectivo debe tener:", a: ["Objetivo, mensaje, jerarquia y accion", "Mucho texto sin prioridad", "Todos los servicios posibles"], correct: 0 },
        { q: "Rotulacion se recomienda cuando:", a: ["La presencia fisica debe atraer u orientar", "El cliente quiere un CMS", "Solo hay que escribir copies"], correct: 0 }
      ]
    },
    {
      id: "web",
      title: "Desarrollo Web",
      href: "modulo-web.html",
      time: "4 h",
      level: "Base",
      summary: "Landing page, sitio corporativo, ecommerce, sistema de citas, CMS y automatizacion.",
      outcome: "Flor podra recomendar una solucion web segun accion, proceso y etapa del negocio.",
      lessons: [
        {
          title: "Mapa de soluciones web",
          objective: "Distinguir producto web por problema, no por nombre.",
          concepts: ["Landing page vende una accion concreta.", "Sitio corporativo construye confianza y explica una empresa.", "Ecommerce procesa catalogo, pedidos y pagos.", "Sistema de citas organiza disponibilidad y reservas."],
          examples: ["Campana de Meta: landing.", "Empresa con varias areas: sitio corporativo.", "Boutique con tallas: ecommerce.", "Clinica con horarios: sistema de citas."],
          exercise: "Relaciona 6 tipos de negocio con la solucion web mas adecuada."
        },
        {
          title: "Landing pages que convierten",
          objective: "Entender estructura minima para campanas.",
          concepts: ["Una landing debe tener promesa, beneficio, prueba, oferta y llamada a la accion.", "No debe dispersar al usuario con demasiadas rutas.", "Debe conectarse con WhatsApp, formulario o agenda."],
          examples: ["Panaderia: promocion + ubicacion + WhatsApp.", "Servicio: beneficio + confianza + agenda.", "Curso: temario + fecha + pago o registro."],
          exercise: "Arma el orden de una landing para un negocio de servicios."
        },
        {
          title: "Ecommerce, citas y CMS",
          objective: "Identificar cuando una web necesita operacion interna.",
          concepts: ["Ecommerce requiere catalogo, variantes, pedidos y metodo de cobro.", "Citas requiere disponibilidad, confirmacion y datos del cliente.", "CMS conviene cuando el cliente editara contenido seguido."],
          examples: ["Tienda con inventario cambiante: ecommerce o catalogo administrable.", "Barberia: citas con horarios.", "Escuela: CMS para avisos y cursos."],
          exercise: "Define que datos necesita cada sistema antes de iniciar implementacion."
        },
        {
          title: "Automatizacion y seguimiento",
          objective: "Detectar procesos repetitivos que pueden conectarse.",
          concepts: ["Automatizar no es complicar: es evitar capturas repetidas.", "Formularios pueden alimentar hojas, CRM, correos o WhatsApp.", "La automatizacion necesita reglas claras."],
          examples: ["Lead web a hoja + aviso interno.", "Cita agendada a confirmacion.", "Pedido recibido a mensaje de preparacion."],
          exercise: "Dibuja el flujo desde que entra un lead hasta que alguien lo atiende."
        }
      ],
      practice: [
        { prompt: "Una estetica recibe muchas llamadas preguntando horarios.", answer: "Sistema de citas con horarios, servicios, datos del cliente y confirmacion. Puede sumarse landing si viene de campana." },
        { prompt: "Una marca vende por Instagram y pierde pedidos entre mensajes.", answer: "Catalogo o ecommerce con variantes, pedido ordenado y canal de pago o confirmacion." },
        { prompt: "Una empresa industrial quiere verse formal para clientes grandes.", answer: "Sitio corporativo con servicios, experiencia, procesos, clientes, contacto y formularios." }
      ],
      questions: [
        { q: "Una landing page sirve mejor para:", a: ["Una accion principal de campana", "Administrar inventario complejo", "Editar cientos de noticias"], correct: 0 },
        { q: "Un ecommerce se vende cuando:", a: ["Hay productos, variantes o pedidos recurrentes", "Solo se necesita presencia basica", "No hay catalogo"], correct: 0 },
        { q: "Un sistema de citas resuelve:", a: ["Disponibilidad, reserva y confirmacion", "Vinil en fachada", "Diseno de logo"], correct: 0 },
        { q: "Un CMS conviene cuando:", a: ["El cliente actualizara contenido con frecuencia", "Nunca se hara ningun cambio", "Solo quiere una lona"], correct: 0 },
        { q: "Automatizar requiere primero:", a: ["Un proceso claro con reglas", "Comprar anuncios", "Cambiar el logo"], correct: 0 }
      ]
    },
    {
      id: "marketing",
      title: "Marketing Digital",
      href: "modulo-marketing.html",
      time: "4 h",
      level: "Base",
      summary: "Meta Ads, Google Ads, diferencias, objetivos y ejemplos con Nissan, Pan Comido y Dragon de Oro.",
      outcome: "Flor podra explicar que canal usar segun intencion, demanda y objetivo.",
      lessons: [
        {
          title: "Meta Ads vs Google Ads",
          objective: "Entender diferencia entre descubrir y buscar.",
          concepts: ["Meta interrumpe con contenido visual para despertar interes.", "Google captura personas que ya estan buscando algo.", "Ningun canal es mejor siempre; depende del objetivo."],
          examples: ["Pan Comido: Meta para antojo visual.", "Nissan: Google para busquedas de cotizacion.", "Dragon de Oro: Meta para combos y Google para busqueda local."],
          exercise: "Clasifica 10 objetivos como Meta, Google o mixto."
        },
        {
          title: "Objetivos y embudo",
          objective: "Elegir campana por etapa del cliente.",
          concepts: ["Reconocimiento: que te vean.", "Consideracion: que pidan informacion.", "Conversion: que coticen, compren o agenden.", "Remarketing: volver a impactar a quien ya interactuo."],
          examples: ["Restaurante nuevo: reconocimiento local.", "Clinica: leads y agenda.", "Ecommerce: conversion y remarketing."],
          exercise: "Define objetivo de campana para tres negocios locales."
        },
        {
          title: "Creativos, oferta y destino",
          objective: "Conectar anuncio con pagina, WhatsApp o formulario.",
          concepts: ["El anuncio no vende solo: necesita destino claro.", "La oferta debe ser concreta y entendible.", "El creativo debe mostrar producto, beneficio o prueba."],
          examples: ["Anuncio de combo lleva a menu/pedido.", "Anuncio de cita lleva a agenda.", "Anuncio de auto lleva a landing de cotizacion."],
          exercise: "Escribe una oferta y CTA para un restaurante."
        },
        {
          title: "Lectura basica de resultados",
          objective: "Saber que mirar sin perderse en metricas.",
          concepts: ["Alcance e impresiones muestran visibilidad.", "Clics y CTR muestran interes.", "Mensajes, leads o compras muestran accion.", "Costo por resultado ayuda a decidir ajustes."],
          examples: ["Muchos clics sin mensajes: revisar destino.", "Mucho alcance sin clics: revisar creativo/oferta.", "Leads caros: revisar segmentacion y propuesta."],
          exercise: "Interpreta 3 resultados y propone un ajuste."
        }
      ],
      practice: [
        { prompt: "Nissan quiere aumentar cotizaciones de autos nuevos.", answer: "Google Search para intencion de cotizar + landing. Meta puede apoyar con remarketing y promociones visuales." },
        { prompt: "Pan Comido quiere vender mas desayunos en zona cercana.", answer: "Meta Ads local con fotos, oferta, horarios y WhatsApp/menu. Medir mensajes y pedidos iniciados." },
        { prompt: "Dragon de Oro quiere aparecer cuando buscan comida china.", answer: "Google local/search para busquedas con intencion. Complementar con Meta para combos y recordacion." }
      ],
      questions: [
        { q: "Meta Ads es fuerte para:", a: ["Descubrimiento visual y demanda latente", "Solo busquedas exactas", "Hospedaje web"], correct: 0 },
        { q: "Google Ads suele ser fuerte cuando:", a: ["El usuario ya busca una solucion", "Nadie tiene intencion", "Solo se requiere diseno"], correct: 0 },
        { q: "Un anuncio necesita:", a: ["Oferta, creativo y destino claro", "Solo presupuesto", "Solo muchas palabras"], correct: 0 },
        { q: "CTR ayuda a leer:", a: ["Interes relativo en el anuncio", "Calidad del vinil", "Contrasenas"], correct: 0 },
        { q: "Para Pan Comido, Meta ayuda principalmente a:", a: ["Mostrar antojo, ubicacion y promocion", "Configurar un CMS", "Imprimir menus"], correct: 0 }
      ]
    },
    {
      id: "comercial",
      title: "Area Comercial",
      href: "modulo-comercial.html",
      time: "4 h",
      level: "Base",
      summary: "Lead, diagnostico, propuesta, cierre, implementacion, setup y mensualidad.",
      outcome: "Flor podra ordenar oportunidades comerciales y explicar pagos unicos vs recurrentes.",
      lessons: [
        {
          title: "Proceso comercial Ixmati",
          objective: "Dominar el flujo de lead a mensualidad.",
          concepts: ["Lead es una oportunidad, no una venta cerrada.", "Diagnostico evita propuestas genericas.", "Propuesta conecta necesidad, alcance, precio y siguiente paso.", "Cierre requiere acuerdo claro antes de implementar."],
          examples: ["Lead por WhatsApp se registra antes de cotizar.", "Diagnostico detecta si necesita web, ads o visual.", "Propuesta define entregables y tiempos."],
          exercise: "Ordena una conversacion comercial en etapas."
        },
        {
          title: "Diagnostico consultivo",
          objective: "Hacer preguntas que revelen necesidad real.",
          concepts: ["Preguntar objetivo, problema, urgencia, decision y presupuesto aproximado.", "Detectar si el cliente pide una cosa pero necesita otra.", "No prometer precio exacto sin alcance."],
          examples: ["Pide redes, pero no tiene destino para leads.", "Pide web, pero no tiene oferta clara.", "Pide logo, pero necesita identidad completa."],
          exercise: "Escribe 8 preguntas de diagnostico para un lead nuevo."
        },
        {
          title: "SETUP",
          objective: "Explicar pago unico sin confundirlo con mensualidad.",
          concepts: ["Setup cubre arranque, construccion, configuracion o preparacion.", "Tiene inicio y fin definidos.", "Puede incluir diseno inicial, instalacion, pagina, cuentas o plantillas."],
          examples: ["Crear landing y configurar formulario.", "Preparar identidad visual inicial.", "Configurar campana y pixel."],
          exercise: "Lista 5 entregables que pueden ser setup."
        },
        {
          title: "Mensualidad",
          objective: "Explicar valor recurrente y continuidad.",
          concepts: ["Mensualidad cubre operacion, gestion, soporte, mantenimiento o mejora continua.", "Debe tener alcance mensual claro.", "Se justifica con seguimiento y resultados, no solo presencia."],
          examples: ["Operacion de ads y reportes.", "Mantenimiento web y cambios.", "Contenido mensual y programacion."],
          exercise: "Convierte un setup web en una propuesta con mensualidad."
        }
      ],
      practice: [
        { prompt: "Un cliente pide 'precio de pagina web' por WhatsApp.", answer: "No dar precio seco. Registrar lead y diagnosticar objetivo, tipo de web, secciones, funcionalidades, fecha y decision." },
        { prompt: "Un cliente cree que la mensualidad es lo mismo que pagar la pagina.", answer: "Explicar que setup construye la pagina y mensualidad cubre continuidad: soporte, cambios, mantenimiento o marketing." },
        { prompt: "Un prospecto quiere iniciar campana manana sin oferta definida.", answer: "Escalar y diagnosticar. Definir oferta, destino, presupuesto, creativo y objetivo antes de prometer arranque." }
      ],
      questions: [
        { q: "El primer paso comercial es:", a: ["Lead", "Mensualidad", "Implementacion"], correct: 0 },
        { q: "Diagnostico sirve para:", a: ["Entender necesidad y contexto", "Evitar preguntas", "Cerrar sin datos"], correct: 0 },
        { q: "Setup es:", a: ["Pago unico de arranque o construccion", "Pago recurrente", "Reporte mensual"], correct: 0 },
        { q: "Mensualidad es:", a: ["Pago recurrente por continuidad", "Anticipo unico", "Descuento"], correct: 0 },
        { q: "Una propuesta debe incluir:", a: ["Alcance, precio, tiempos y siguiente paso", "Solo una frase", "Nada de entregables"], correct: 0 }
      ]
    },
    {
      id: "operacion",
      title: "Operacion Interna",
      href: "modulo-operacion.html",
      time: "3 h",
      level: "Base",
      summary: "Atencion inicial, registro, seguimiento, reuniones, escalamiento y buenas practicas.",
      outcome: "Flor podra operar prospectos sin perder informacion ni siguientes pasos.",
      lessons: [
        {
          title: "Atencion inicial",
          objective: "Responder claro y orientar al siguiente paso.",
          concepts: ["La primera respuesta debe reconocer necesidad y abrir diagnostico.", "No se promete algo que no este confirmado.", "Se debe registrar origen y datos clave."],
          examples: ["Mensaje de WhatsApp: saludar, preguntar giro y objetivo.", "Instagram: pedir telefono o canal formal.", "Referido: registrar quien lo recomendo."],
          exercise: "Redacta una respuesta inicial para un prospecto de web."
        },
        {
          title: "Registro de prospectos",
          objective: "Crear memoria operativa del seguimiento.",
          concepts: ["Registrar nombre, negocio, telefono, origen, servicio, urgencia y estado.", "Las notas deben ser concretas y accionables.", "Sin registro no hay control comercial."],
          examples: ["Estado: nuevo, diagnosticado, propuesta, seguimiento, cerrado.", "Nota mala: 'quiere info'. Nota buena: 'quiere ecommerce para 40 productos'."],
          exercise: "Convierte 5 mensajes sueltos en registros claros."
        },
        {
          title: "Seguimiento y reuniones",
          objective: "Evitar oportunidades olvidadas.",
          concepts: ["Cada conversacion debe cerrar con accion o fecha.", "Reunion debe tener objetivo, hora, canal y participantes.", "El seguimiento debe retomar contexto."],
          examples: ["Enviar propuesta el jueves y confirmar viernes.", "Reunion para diagnostico, no para improvisar precio.", "Seguimiento: 'quedamos en revisar menu digital'."],
          exercise: "Agenda una reunion con objetivo y datos minimos."
        },
        {
          title: "Escalar dudas",
          objective: "Saber cuando pedir apoyo interno.",
          concepts: ["Escalar precio especial, alcance tecnico, urgencias, promesas sensibles y dudas de produccion.", "Escalar con contexto, no con capturas sueltas.", "La respuesta final al cliente debe ser clara y unificada."],
          examples: ["Cambio de alcance en ecommerce.", "Entrega urgente de impresion.", "Cliente pide integracion no contemplada."],
          exercise: "Escribe un mensaje interno de escalamiento con contexto completo."
        }
      ],
      practice: [
        { prompt: "Un prospecto escribe: 'me interesa publicidad, cuanto cuesta?'", answer: "Responder con apertura, registrar y diagnosticar objetivo, negocio, zona, oferta, presupuesto y canal actual." },
        { prompt: "Un cliente pide cambio tecnico que no entiendes.", answer: "No improvisar. Escalar con contexto: cliente, proyecto, solicitud, fecha, impacto y evidencia." },
        { prompt: "Hay 12 conversaciones abiertas sin siguiente paso.", answer: "Actualizar estado, priorizar por urgencia/oportunidad y cerrar cada una con fecha o accion concreta." }
      ],
      questions: [
        { q: "La atencion inicial debe:", a: ["Registrar datos y orientar siguiente paso", "Prometer todo", "Ignorar origen"], correct: 0 },
        { q: "Un buen registro incluye:", a: ["Contacto, origen, servicio, estado y notas", "Solo nombre", "Solo saludo"], correct: 0 },
        { q: "Una reunion debe tener:", a: ["Fecha, hora, objetivo y participantes", "Solo un emoji", "Nada definido"], correct: 0 },
        { q: "Se escalan dudas cuando:", a: ["Hay decision tecnica, precio especial o riesgo", "Todo esta claro", "Nunca"], correct: 0 },
        { q: "Una buena practica es:", a: ["Documentar acuerdos y siguientes pasos", "Cerrar sin resumen", "Cambiar datos"], correct: 0 }
      ]
    }
  ];

  var quickLinks = [
    { title: "Produccion Flor", href: "produccion-flor.html", summary: "Centro accionable de ordenes, carruseles, formatos y checklists." },
    { title: "Tiendas", href: "tiendas.html", summary: "Planes digitales para catalogos, pedidos y ventas." },
    { title: "Servicios", href: "servicios.html", summary: "Presencia, citas y captacion para negocios de servicio." },
    { title: "Restaurantes", href: "restaurantes.html", summary: "Menus, pedidos, reservas y campanas locales." },
    { title: "Redes Sociales", href: "redes-sociales.html", summary: "Contenido mensual, constancia y anuncios." }
  ];

  modules = [
    {
      id: "estudio-visual",
      title: "Estudio Visual",
      href: "modulo-estudio-visual.html",
      time: "8 h",
      level: "Operacion visual",
      badge: "Preprensa Basica",
      summary: "Preprensa, impresion, diseno para produccion, lonas, viniles, rotulacion y recepcion de archivos.",
      outcome: "La persona podra revisar archivos antes de producir, detectar errores comunes y pedir informacion sin frenar la operacion.",
      lessons: [
        lesson("Preparacion correcta de archivos para impresion", "Validar un archivo antes de mandarlo a produccion.", "Preprensa es la revision tecnica antes de imprimir. Evita retrabajos, colores incorrectos, cortes mal hechos y archivos pixelados.", "Sirve para que produccion reciba un archivo listo, con medidas reales, color correcto, sangrado y tipografias seguras.", "Se usa siempre que haya tarjetas, lonas, viniles, flyers, menus, etiquetas o cualquier pieza fisica.", "Flor debe revisar tamano, CMYK, 300 DPI, sangrado, margenes, tipografias, imagenes y exportacion PDF.", "No mandar RGB directo, no aceptar logos de WhatsApp para gran formato sin advertencia, no omitir sangrado, no confiar en Canva sin revisar.", "Para impresion necesitamos el archivo en buena calidad, preferentemente PDF editable o vectorizado. Si nos envias una imagen, revisamos si tiene calidad suficiente antes de producir.", ["Tamano correcto", "CMYK", "300 DPI", "Sangrado incluido", "Margenes seguros", "Tipografias convertidas", "Imagenes incrustadas", "PDF listo para impresion"], ["Archivo en RGB", "Texto pegado al borde", "PDF comprimido", "Imagen vinculada que no llega"], "Cliente manda un menu en Canva sin sangrado para imprimir 200 piezas. Flor debe pedir archivo PDF para impresion, revisar margenes y advertir si falta sangrado.", "Crear checklist de preprensa para validar un archivo antes de produccion."),
        lesson("Errores comunes en archivos de clientes", "Diagnosticar problemas antes de prometer entrega.", "Muchos clientes mandan archivos que se ven bien en pantalla pero fallan al imprimir.", "Sirve para detectar riesgos y pedir correcciones con claridad.", "Se usa cuando llega un archivo de Canva, JPG, captura, PDF comprimido o logo de baja calidad.", "Flor debe revisar calidad, medidas, margenes y formato; si no sirve, pedir mejor archivo o escalar a Jad.", "No decir 'no sirve' sin explicar. No imprimir una lona grande con un logo pixelado sin autorizacion.", "Lo revisamos antes de producir para asegurar que salga bien. Si el archivo no tiene calidad suficiente, te pedimos una mejor version o te proponemos vectorizarlo.", ["Archivo en RGB", "Canva sin sangrado", "Imagen pixelada", "Logo en JPG", "Texto al borde", "Medidas incorrectas", "PDF comprimido", "Sin margen de corte"], ["Logo enviado por WhatsApp", "Foto descargada de Facebook", "Medida en pixeles cuando se necesita metros"], "Cliente quiere una lona de 3 metros y manda logo JPG de WhatsApp. Flor debe pedir vector/PDF o advertir posible pixelado.", "Diagnosticar 5 problemas en un archivo ficticio."),
        lesson("Diseno para impresion vs diseno digital", "Adaptar una pieza digital a un formato fisico.", "Disenar para redes no es igual que disenar para impresion. Cambia tamano, lectura, color, distancia y material.", "Sirve para que una idea visual funcione cuando se imprime y se ve en la vida real.", "Se usa al convertir posts en flyers, menus, lonas, posters, etiquetas o viniles.", "Flor debe confirmar tamano real, distancia de lectura, jerarquia, contraste, material y acabado.", "No usar texto pequeno en lona, no saturar flyers, no ignorar contraste fisico, no usar medidas de redes para impresion.", "Podemos adaptar tu post para impresion, pero necesitamos ajustar medidas, margenes y legibilidad para que funcione en fisico.", ["Tamano final", "Distancia de lectura", "Contraste", "Jerarquia visual", "Material", "Acabado"], ["Texto pequeno", "Muchos elementos", "Colores sin contraste", "Formato cuadrado usado como flyer sin adaptar"], "Un post 1080x1080 debe convertirse en flyer media carta. Flor debe pedir medida final y adaptar jerarquia.", "Convertir un post de redes en flyer imprimible."),
        lesson("Lonas, viniles y rotulacion", "Elegir la solucion correcta segun uso, superficie y duracion.", "Lona, vinil y rotulacion resuelven necesidades distintas. La decision depende de lugar, duracion, superficie e instalacion.", "Sirve para cotizar mejor y evitar materiales incorrectos.", "Se usa en fachadas, cristales, vehiculos, eventos, interiores y promociones temporales.", "Flor debe preguntar medidas, superficie, exterior/interior, duracion esperada, instalacion y fecha.", "No cotizar sin medidas, no asumir superficie, no prometer instalacion sin confirmar, no mezclar lona con vinil sin entender uso.", "Para recomendarte bien necesitamos saber medida, donde se colocara, si es interior o exterior y cuanto tiempo debe durar.", ["Medidas", "Superficie", "Exterior/interior", "Duracion", "Instalacion", "Fecha de entrega"], ["No preguntar superficie", "No confirmar instalacion", "No distinguir temporal vs permanente"], "Cliente quiere anunciar apertura por 10 dias: probablemente lona. Cliente quiere decorar cristal fijo: probablemente vinil.", "Elegir solucion correcta para 5 clientes."),
        lesson("Recepcion de archivos de clientes", "Pedir archivos sin sonar grosera y saber cuando escalar.", "La recepcion ordenada evita vueltas. Se debe pedir el formato correcto y explicar por que.", "Sirve para cuidar relacion con cliente y proteger produccion.", "Se usa cada vez que el cliente envia logo, arte, fotos, PDF, Canva o referencias.", "Flor debe pedir PDF editable, vector, AI, EPS, SVG, fotos en alta calidad o enlace editable cuando aplique.", "No aceptar capturas como archivo final, no corregir sin autorizacion, no culpar al cliente.", "Para impresion necesitamos el archivo en buena calidad, preferentemente PDF editable o vectorizado. Si nos envias una imagen, revisamos si tiene calidad suficiente antes de producir.", ["PDF editable", "AI/EPS/SVG", "Imagen alta calidad", "Enlace Canva editable", "Medidas", "Version final autorizada"], ["Captura de pantalla", "Logo en chat", "Archivo sin medidas", "Foto borrosa"], "Cliente manda captura de logo. Flor responde con script, pide vector/PDF y ofrece revision.", "Redactar 3 respuestas para pedir archivos correctamente."),
        lesson("Orden de produccion visual", "Llenar una OP completa para que produccion no adivine.", "Una orden de produccion visual concentra datos, archivos, fechas y responsables.", "Sirve para que todos sepan que se hace, con que material, para cuando y con que archivo.", "Se usa antes de imprimir, cortar, instalar, disenar o entregar.", "Flor debe capturar cliente, producto, medidas, cantidad, material, acabado, fecha, responsable y archivos.", "No mandar instrucciones por partes, no dejar medidas en mensajes sueltos, no iniciar sin archivo final.", "Te confirmo los datos de produccion para evitar errores: producto, medida, cantidad, material, acabado y fecha de entrega.", ["Cliente", "Producto", "Medidas", "Cantidad", "Material", "Acabado", "Fecha", "Responsable", "Archivos"], ["Falta de fecha", "Medidas incompletas", "Archivo no autorizado", "Responsable indefinido"], "Pedido de 50 menus plastificados: Flor debe llenar OP con medida, paginas, cantidad, acabado, fecha y archivo final.", "Llenar una orden de produccion completa.")
      ],
      activity: activity("Revisar un archivo ficticio para impresion.", "Checklist de preprensa completado y comentario para el cliente.", ["Detecto problemas de color", "Detecto falta de sangrado", "Detecto resolucion baja", "Propuso solucion clara"]),
      practice: [
        { prompt: "Cliente manda logo JPG de WhatsApp para lona de 3 metros.", answer: "Revisar calidad, pedir vector/PDF editable o advertir posible pixelado antes de producir." },
        { prompt: "Archivo Canva sin sangrado para flyer.", answer: "Pedir PDF para impresion con sangrado o ajustar archivo antes de mandar a corte." },
        { prompt: "Post cuadrado de Instagram para imprimir como flyer.", answer: "Adaptar formato, jerarquia, margenes, tamano final y legibilidad." },
        { prompt: "Cliente pide vinil para cristal exterior.", answer: "Pedir medidas, superficie, exposicion al sol, duracion e instalacion." }
      ],
      questions: [
        q("Un cliente manda logo JPG de WhatsApp para imprimir una lona de 3 metros. Que debes hacer?", ["Mandarlo directo a impresion", "Revisar calidad, pedir vector o advertir posible pixelado", "Cambiarle el color sin avisar"], 1),
        q("Para impresion profesional, el archivo idealmente debe estar en:", ["RGB", "CMYK", "Modo pantalla"], 1),
        q("El sangrado sirve para:", ["Evitar bordes blancos despues del corte", "Hacer el archivo mas pequeno", "Cambiar la tipografia"], 0),
        q("300 DPI importa porque:", ["Ayuda a que la imagen tenga resolucion suficiente para imprimir", "Hace que el color sea azul", "Sirve solo para redes"], 0),
        q("Si el texto esta pegado al borde, el riesgo principal es:", ["Que se corte o se vea mal acabado", "Que pese menos", "Que se publique solo"], 0),
        q("Canva sin sangrado para flyer debe:", ["Revisarse y ajustarse antes de imprimir", "Mandarse sin revisar", "Convertirse a video"], 0),
        q("Para cotizar vinil se debe preguntar:", ["Superficie, medidas, interior/exterior e instalacion", "Solo color favorito", "Contrasena de Facebook"], 0),
        q("Convertir textos a curvas ayuda a:", ["Evitar cambios de tipografia al abrir/imprimir", "Borrar el diseno", "Subirlo a TikTok"], 0),
        q("Una orden visual completa debe incluir:", ["Cliente, producto, medidas, cantidad, material, acabado, fecha y archivos", "Solo un audio", "Solo precio"], 0),
        q("Si el archivo no sirve, la mejor respuesta es:", ["Explicar el problema y pedir formato correcto con respeto", "Decir 'esta mal' y cerrar", "Imprimir de todas formas"], 0)
      ]
    },
    {
      id: "web",
      title: "Desarrollo Web",
      href: "modulo-web.html",
      time: "6 h",
      level: "Operacion web",
      badge: "Asistente Web",
      summary: "Diagnostico web, informacion inicial, landing, sitio, ecommerce, citas, CMS, setup y mantenimiento.",
      outcome: "La persona podra identificar que tipo de web necesita un cliente y pedir informacion completa antes de iniciar.",
      lessons: [
        lesson("Como identificar que necesita el cliente", "Clasificar necesidad web sin vender de mas.", "No todos necesitan la misma web. La solucion depende de accion, proceso y operacion.", "Sirve para recomendar landing, sitio, ecommerce, citas o CMS con criterio.", "Se usa en diagnostico inicial.", "Flor debe preguntar objetivo, tipo de negocio, que quiere que haga el usuario y como atienden hoy.", "No vender ecommerce si solo necesita captar prospectos; no vender landing si necesita presencia completa.", "Una landing capta una accion. Un sitio da presencia formal. Ecommerce vende productos. Citas agenda servicios. CMS actualiza contenido seguido.", ["Fisioli: citas", "Gerokally: sitio/landing", "Pan Comido: pedidos/menu", "Dragon de Oro: menu/pedidos", "Boutique Plus: ecommerce", "Gustavo Molina Nissan: landing", "Live Travel: cotizador/sitio", "Photos Time: sitio/galeria", "Consultoria Kii: sitio corporativo", "Nutrivida: landing/sitio"], ["Diagnostico incompleto", "Solucion sobrada", "No entender operacion"], "Boutique Plus vende productos con variantes: ecommerce o catalogo administrable.", "Clasificar 10 negocios reales por tipo de solucion web."),
        lesson("Informacion antes de iniciar una web", "Pedir datos completos para evitar atrasos.", "Una web se traba cuando faltan textos, fotos, logo, servicios u objetivo.", "Sirve para iniciar implementacion con orden.", "Se usa antes de cotizar fino o arrancar setup.", "Flor debe reunir negocio, logo, servicios, fotos, WhatsApp, ubicacion, redes, oferta, referencias y objetivo.", "No arrancar con 'luego me lo mandas'; no inventar informacion sensible.", "Para avanzar necesitamos reunir logo, servicios, fotos, WhatsApp, ubicacion, redes, oferta principal y referencias visuales.", ["Nombre del negocio", "Logo", "Servicios", "Fotos", "WhatsApp", "Ubicacion", "Redes", "Oferta principal", "Referencias visuales", "Objetivo del sitio"], ["Sin fotos", "Sin CTA", "Sin WhatsApp validado", "Sin objetivo"], "Cliente quiere web pero no tiene fotos ni servicios escritos. Flor debe pedir checklist antes de prometer fecha.", "Completar checklist de inicio web."),
        lesson("Como explicar una landing", "Decirlo simple y orientado a accion.", "Una landing es una pagina enfocada en una sola accion.", "Sirve para campanas, cotizaciones, agenda, registros y ofertas concretas.", "Se usa cuando el cliente necesita captar prospectos o mover una promocion.", "Flor debe explicar beneficio, accion y diferencia contra sitio completo.", "No decir que landing es 'pagina barata'; no llenarla con muchas rutas.", "Una landing es una pagina enfocada en una sola accion: que te escriban, agenden, compren o coticen.", ["Accion unica", "Oferta clara", "WhatsApp/formulario", "Prueba visual", "CTA"], ["Demasiados botones", "Sin oferta", "Sin destino"], "Gustavo Molina Nissan necesita cotizaciones: landing con formulario/WhatsApp.", "Redactar una explicacion de landing para WhatsApp."),
        lesson("Setup y mantenimiento web", "Separar construir de cuidar.", "Setup es construir o configurar. Mantenimiento es cuidar, actualizar y corregir.", "Sirve para explicar pagos unicos y recurrentes.", "Se usa al presentar propuesta y al responder que incluye.", "Flor debe explicar entregables de setup y alcance mensual de mantenimiento.", "No prometer cambios ilimitados si no estan incluidos; no confundir hosting con campanas.", "El setup construye la web. El mantenimiento la cuida: cambios, soporte, correcciones y actualizaciones.", ["Setup: construir", "Mantenimiento: cuidar", "Actualizaciones", "Soporte", "Cambios menores"], ["Cobrar mensualidad sin alcance", "No explicar vigencia", "Prometer todo incluido"], "Cliente pregunta por que hay mensualidad despues de la web. Flor explica mantenimiento y soporte.", "Crear ejemplo de propuesta con setup y mantenimiento.")
      ],
      activity: activity("Clasificar 10 negocios reales por solucion web recomendada.", "Tabla con negocio, necesidad, solucion y razon.", ["Identifico landing vs sitio", "Identifico ecommerce", "Identifico citas", "Pidio informacion inicial correcta"]),
      practice: [
        { prompt: "Fisioli agenda consultas y recibe mensajes preguntando horarios.", answer: "Sistema de citas o landing con agenda. Pedir servicios, horarios, ubicacion, WhatsApp y reglas de reserva." },
        { prompt: "Boutique Plus vende productos con tallas y colores.", answer: "Ecommerce o catalogo con variantes, carrito y flujo de pedido." },
        { prompt: "Consultoria Kii necesita presencia formal.", answer: "Sitio corporativo con servicios, metodologia, casos, contacto y formulario." }
      ],
      questions: [
        q("Un negocio quiere captar prospectos para una sola oferta. Conviene:", ["Landing page", "CMS complejo", "Rotulacion"], 0),
        q("Si vende productos con variantes, conviene evaluar:", ["Ecommerce", "Solo blog", "Un flyer"], 0),
        q("Si agenda servicios, la funcion clave es:", ["Sistema de citas", "Logo animado", "PDF sin formulario"], 0),
        q("Antes de iniciar una web se debe pedir:", ["Logo, servicios, fotos, WhatsApp, ubicacion, redes, oferta y objetivo", "Solo el nombre", "Solo colores"], 0),
        q("Una landing se explica como:", ["Pagina enfocada en una sola accion", "Red social", "Archivo de impresion"], 0),
        q("Setup web significa:", ["Construir/configurar", "Publicar diario", "Pagar anuncios"], 0),
        q("Mantenimiento web significa:", ["Cuidar, actualizar y corregir", "Volver a construir todo cada mes", "Imprimir flyers"], 0),
        q("Live Travel probablemente necesita:", ["Sitio/cotizador segun proceso", "Vinil", "Solo logo JPG"], 0),
        q("Si no hay objetivo del sitio, Flor debe:", ["Diagnosticar antes de avanzar", "Inventar objetivo", "Cerrar chat"], 0),
        q("CMS conviene cuando:", ["El cliente actualiza contenido seguido", "Nunca cambia nada", "Solo necesita lona"], 0)
      ]
    },
    {
      id: "marketing",
      title: "Marketing Digital",
      href: "modulo-marketing.html",
      time: "5 h",
      level: "Marketing base",
      badge: "Marketing Base",
      summary: "Redes, pauta, Meta Ads, Google Ads, datos para campanas, reportes y promesas que no se deben hacer.",
      outcome: "La persona podra traducir 'quiero redes' a una necesidad real y pedir datos antes de ofrecer campanas.",
      lessons: [
        lesson("Que quiere decir la gente cuando pide redes", "Desarmar una solicitud ambigua.", "Cuando un cliente dice 'quiero redes' puede pedir diseno, manejo mensual, pauta, reels, calendario o reportes.", "Sirve para orientar sin vender el paquete equivocado.", "Se usa en el primer contacto.", "Flor debe preguntar si busca diseno, publicaciones, pauta, reels, estrategia, calendario, reportes o manejo completo.", "No asumir que redes siempre incluye anuncios; no prometer community sin alcance.", "Claro. Para orientarte mejor, buscas diseno y publicaciones, campanas pagadas, reels, estrategia o todo el manejo mensual?", ["Diseno de posts", "Community management", "Pauta", "Contenido", "Reels", "Estrategia", "Calendario", "Reportes"], ["Responder precio sin diagnostico", "Confundir pauta con publicaciones", "No preguntar objetivo"], "Cliente dice 'quiero redes'. Flor abre diagnostico y separa servicio mensual de anuncios.", "Responder a cliente que dice: quiero redes."),
        lesson("Meta Ads vs Google Ads para negocios locales", "Explicar descubrimiento vs intencion.", "Meta genera descubrimiento. Google captura intencion de busqueda.", "Sirve para recomendar canal segun etapa del cliente.", "Se usa al proponer campanas.", "Flor debe preguntar si el cliente necesita visibilidad, mensajes, busquedas, cotizaciones o visitas.", "No decir que un canal siempre es mejor; no prometer ventas garantizadas.", "Meta te ayuda a que mas personas te descubran. Google ayuda cuando alguien ya esta buscando lo que vendes.", ["Meta: descubrimiento", "Google: intencion", "Negocio local", "Oferta", "Zona"], ["Canal sin objetivo", "Campana sin destino", "Presupuesto irreal"], "Pan Comido usa Meta para antojo; Nissan puede usar Google para cotizaciones.", "Clasificar 6 casos como Meta, Google o mixto."),
        lesson("Datos antes de ofrecer campanas", "Pedir informacion minima para no improvisar.", "Una campana sin datos se vuelve prueba a ciegas.", "Sirve para definir oferta, publico, zona, presupuesto y objetivo.", "Se usa antes de propuesta de pauta.", "Flor debe pedir que vende, a quien, zona, presupuesto, oferta, redes, sitio, WhatsApp y objetivo.", "No iniciar pauta sin oferta ni destino.", "Para recomendar campana necesitamos saber que vendes, a quien, en que zona, presupuesto, oferta y donde aterrizara la gente.", ["Que vendes", "A quien le vendes", "Zona", "Presupuesto", "Oferta", "Redes actuales", "Sitio web", "WhatsApp", "Objetivo"], ["Sin presupuesto", "Sin oferta", "Sin WhatsApp activo"], "Cliente quiere anuncios pero no tiene oferta. Flor debe pedir propuesta concreta antes de avanzar.", "Completar brief de campana."),
        lesson("Que NO prometer", "Cuidar expectativas comerciales.", "Marketing mejora oportunidades, pero no garantiza ventas sin operacion, inversion y oferta.", "Sirve para proteger a Ixmati y al cliente.", "Se usa en ventas, seguimiento y reportes.", "Flor debe hablar de objetivos medibles, aprendizaje y optimizacion.", "No prometer ventas garantizadas, viralidad, resultados sin inversion o fechas imposibles.", "Podemos trabajar para generar mas oportunidades y medir resultados, pero no prometemos ventas garantizadas porque dependen de oferta, presupuesto, atencion y mercado.", ["No ventas garantizadas", "No viralidad garantizada", "No resultados sin inversion", "No fechas imposibles"], ["Prometer leads exactos", "Prometer viral", "No mencionar inversion"], "Cliente pide 'asegurame ventas esta semana'. Flor responde con claridad y expectativas reales.", "Redactar respuesta para expectativa irreal.")
      ],
      activity: activity("Responder a un cliente que dice 'quiero redes'.", "Mensaje de WhatsApp con preguntas de diagnostico y siguiente paso.", ["No asumio el servicio", "Pregunto objetivo", "Separo redes organicas de pauta", "Pidio datos minimos"]),
      practice: [
        { prompt: "Cliente: quiero redes.", answer: "Preguntar si busca diseno/publicaciones, pauta, reels, estrategia o manejo mensual; pedir objetivo y negocio." },
        { prompt: "Cliente quiere ventas garantizadas con poco presupuesto.", answer: "Explicar que se trabaja por oportunidades medibles, no ventas garantizadas." },
        { prompt: "Restaurante local quiere mas pedidos.", answer: "Meta para descubrimiento/oferta visual y destino a WhatsApp/menu; Google si hay busqueda local." }
      ],
      questions: [
        q("Cuando alguien pide 'redes', puede referirse a:", ["Diseno, pauta, reels, estrategia, calendario o reportes", "Solo imprimir lonas", "Solo hosting"], 0),
        q("Meta Ads ayuda principalmente a:", ["Generar descubrimiento", "Capturar solo busquedas exactas", "Convertir textos a curvas"], 0),
        q("Google Ads ayuda principalmente cuando:", ["Ya hay intencion de busqueda", "No hay oferta", "Solo hay JPG"], 0),
        q("Antes de campana se debe pedir:", ["Producto, publico, zona, presupuesto, oferta, redes, sitio, WhatsApp y objetivo", "Solo logo", "Solo horario"], 0),
        q("No se debe prometer:", ["Ventas garantizadas", "Reporte", "Revision"], 0),
        q("Si no hay presupuesto definido:", ["Pedir rango y explicar que afecta alcance", "Prometer resultados igual", "Ignorarlo"], 0),
        q("Si no hay destino para los clics:", ["Definir WhatsApp, landing, sitio o formulario", "Lanzar de todos modos", "Cambiar logo"], 0),
        q("Un reporte debe ayudar a:", ["Tomar decisiones y ajustar", "Decorar", "Ocultar resultados"], 0),
        q("Pauta y contenido organico son:", ["Servicios distintos que pueden complementarse", "Exactamente lo mismo", "Impresion"], 0),
        q("Ante expectativa imposible Flor debe:", ["Aclarar alcance y condiciones", "Prometer para cerrar", "No responder"], 0)
      ]
    },
    {
      id: "comercial",
      title: "Area Comercial",
      href: "modulo-comercial.html",
      time: "5 h",
      level: "Atencion comercial",
      badge: "Comercial Junior",
      summary: "Scripts de WhatsApp, diagnostico, precios, objeciones, descuentos, setup, mensualidad y clasificacion de mensajes.",
      outcome: "La persona podra responder prospectos con claridad, clasificar solicitudes y avanzar sin prometer de mas.",
      lessons: [
        lesson("Scripts para mensajes ambiguos", "Abrir diagnostico con orden.", "Muchos prospectos escriben poco: 'quiero redes', 'precio', 'pagina'.", "Sirve para no responder con precio sin contexto.", "Se usa en WhatsApp, Instagram y formularios.", "Flor debe saludar, reconocer necesidad, hacer 1 a 3 preguntas y proponer siguiente paso.", "No saturar con 15 preguntas; no mandar lista de precios sin entender.", "Hola, claro. Para orientarte mejor, buscas que llevemos diseno y publicaciones, campanas pagadas, reels o todo el manejo mensual?", ["Redes", "Pagina web", "Impresion", "Precio", "Que incluye", "Lo voy a pensar", "Descuento", "Mensaje ambiguo"], ["Responder seco", "No preguntar objetivo", "Prometer precio final"], "Cliente: hola, quiero redes. Flor responde separando servicios y pidiendo objetivo.", "Clasificar 10 mensajes y elegir respuesta."),
        lesson("Preguntas por pagina web e impresion", "Responder segun tipo de servicio.", "Web e impresion necesitan datos distintos.", "Sirve para pedir informacion correcta sin perder al cliente.", "Se usa en primera conversacion.", "Flor debe pedir objetivo para web; medidas, cantidad y material para impresion.", "No mezclar brief web con preprensa; no cotizar impresion sin medidas.", "Para web necesito entender objetivo, secciones y funcion. Para impresion necesito medida, cantidad, material, acabado y archivo.", ["Web: objetivo, secciones, funcion", "Impresion: medida, cantidad, material, acabado", "Archivo", "Fecha"], ["Cotizar sin alcance", "No pedir archivo", "No validar fecha"], "Cliente pregunta por lona. Flor pide medida, interior/exterior, archivo y fecha.", "Redactar respuestas para web e impresion."),
        lesson("Precios, que incluye y descuentos", "Cuidar valor y alcance.", "El precio depende de alcance. 'Que incluye' debe responder con entregables claros.", "Sirve para vender sin regalar trabajo.", "Se usa antes de propuesta y durante objeciones.", "Flor debe explicar variables, enviar rango si aplica y ofrecer diagnostico.", "No bajar precio sin ajustar alcance; no decir 'todo incluido' si no lo esta.", "Con gusto te orientamos. El precio depende del alcance; si me confirmas objetivo y entregables te damos una propuesta clara.", ["Alcance", "Entregables", "Tiempo", "Revisiones", "Mensualidad"], ["Descuento sin autorizacion", "Todo incluido ambiguo", "Precio sin diagnostico"], "Cliente pide descuento. Flor puede ofrecer ajustar alcance o escalar, no prometer descuento directo.", "Responder 5 objeciones comerciales."),
        lesson("Seguimiento y cierre", "Cerrar conversaciones con siguiente paso.", "Una conversacion sin siguiente paso se pierde.", "Sirve para mantener control comercial.", "Se usa despues de enviar informacion, propuesta o cotizacion.", "Flor debe confirmar interes, fecha, responsable y proximo paso.", "No cerrar con 'quedo pendiente' sin fecha; no perseguir sin contexto.", "Te comparto la informacion. Si te parece, el siguiente paso es confirmar alcance para prepararte propuesta.", ["Fecha", "Proximo paso", "Responsable", "Estado"], ["No registrar seguimiento", "No confirmar decision", "No resumir"], "Cliente dice 'lo voy a pensar'. Flor agenda seguimiento amable y pregunta si hay duda concreta.", "Crear flujo de seguimiento para 3 prospectos.")
      ],
      activity: activity("Clasificar 10 mensajes de prospectos y elegir respuesta correcta.", "Tabla con tipo de solicitud, respuesta sugerida y siguiente paso.", ["Clasifico servicio", "No prometio precio sin alcance", "Uso tono claro", "Definio siguiente paso"]),
      practice: [
        { prompt: "Cliente: Hola, quiero redes.", answer: "Hola, claro. Para orientarte mejor, buscas diseno y publicaciones, campanas pagadas, reels o todo el manejo mensual?" },
        { prompt: "Cliente: Cuanto cuesta una pagina?", answer: "Depende del objetivo y funciones. Te hago unas preguntas rapidas para orientarte: que negocio es, que debe hacer la pagina y que secciones necesitas?" },
        { prompt: "Cliente: Me haces descuento?", answer: "Podemos revisar el alcance para ajustar la propuesta. Si quieres, vemos que es indispensable y que puede quedar para una segunda etapa." },
        { prompt: "Cliente: Lo voy a pensar.", answer: "Claro. Te parece si te escribo el jueves para resolver dudas? Si hay algo especifico que quieras ajustar, lo revisamos." }
      ],
      questions: [
        q("Cliente: quiero redes. Mejor respuesta:", ["Preguntar si busca diseno, pauta, reels, estrategia o manejo mensual", "Mandar precio al azar", "No responder"], 0),
        q("Cliente pregunta precio de web. Primero:", ["Diagnosticar objetivo y alcance", "Dar precio final sin datos", "Pedir solo color"], 0),
        q("Para impresion se debe pedir:", ["Medida, cantidad, material, acabado, archivo y fecha", "Solo logo", "Solo telefono"], 0),
        q("Si piden descuento:", ["Ajustar alcance o escalar, no prometer descuento directo", "Bajar precio siempre", "Cerrar chat"], 0),
        q("Si dicen lo voy a pensar:", ["Agendar seguimiento amable y resolver dudas", "Presionar agresivo", "Eliminar prospecto"], 0),
        q("Que incluye debe responderse con:", ["Entregables claros", "Todo incluido sin detalle", "Nada"], 0),
        q("Mensaje ambiguo requiere:", ["Preguntas cortas de diagnostico", "Respuesta larga sin foco", "Precio final"], 0),
        q("Setup es:", ["Pago unico por arranque/construccion", "Pago recurrente", "Descuento"], 0),
        q("Mensualidad es:", ["Pago recurrente por continuidad", "Archivo final", "Anticipo unico"], 0),
        q("Una conversacion comercial debe cerrar con:", ["Siguiente paso", "Silencio", "Solo emoji"], 0)
      ]
    },
    {
      id: "operacion",
      title: "Operacion Interna",
      href: "modulo-operacion.html",
      time: "5 h",
      level: "Seguimiento interno",
      badge: "Operacion Ordenada",
      summary: "Registro de prospectos, escalamiento, archivos, entregas, cambios, cierre de conversaciones y seguimiento.",
      outcome: "La persona podra documentar prospectos, pasar informacion completa y evitar perdidas de seguimiento.",
      lessons: [
        lesson("Como registrar un prospecto", "Crear ficha util desde el primer contacto.", "Registrar evita perder oportunidades y repetir preguntas.", "Sirve para que cualquier persona entienda estado y siguiente paso.", "Se usa con cada lead de WhatsApp, redes, web o referido.", "Flor debe registrar nombre, negocio, telefono, servicio, origen, urgencia, presupuesto, estado, proximo paso y responsable.", "No dejar datos solo en chat; no escribir notas vagas.", "Te registro para dar seguimiento correcto. Me confirmas nombre del negocio, servicio que buscas y mejor telefono?", ["Nombre", "Negocio", "Telefono", "Servicio solicitado", "Origen", "Urgencia", "Presupuesto aproximado", "Estado", "Proximo paso", "Responsable"], ["Nota vaga", "Sin origen", "Sin proximo paso"], "Prospecto de Instagram pide web. Flor registra origen, servicio y agenda diagnostico.", "Llenar ficha de prospecto."),
        lesson("Pasar informacion a Jared o Jad", "Escalar con contexto completo.", "Escalar no es reenviar capturas sueltas. Es resumir lo importante.", "Sirve para decisiones rapidas y menos retrabajo.", "Se usa con dudas tecnicas, precios especiales, urgencias o cambios sensibles.", "Flor debe mandar cliente, solicitud, contexto, archivos, fecha, duda y decision necesaria.", "No escalar sin explicar; no prometer antes de respuesta.", "Te paso contexto completo: cliente, solicitud, fecha, archivos y duda especifica para decidir.", ["Cliente", "Solicitud", "Contexto", "Archivos", "Fecha", "Duda", "Decision requerida"], ["Capturas sin resumen", "No decir urgencia", "No incluir archivo"], "Cliente pide integracion web rara. Flor resume y escala antes de prometer.", "Redactar escalamiento interno."),
        lesson("Pedir archivos y confirmar entregas", "Mantener orden documental.", "Archivos y entregas deben quedar claros por escrito.", "Sirve para evitar versiones incorrectas y reclamos.", "Se usa en diseno, impresion, web y contenido.", "Flor debe pedir formato correcto, confirmar version final y registrar entrega.", "No usar archivo sin autorizacion; no entregar sin confirmar que es version final.", "Confirmo que este es el archivo final autorizado para producir. Si hay cambios despues, revisamos impacto en tiempo.", ["Formato correcto", "Version final", "Fecha", "Responsable", "Canal de entrega"], ["Version equivocada", "Archivo viejo", "Entrega sin evidencia"], "Cliente manda nuevo logo despues de aprobar. Flor documenta cambio y escala impacto.", "Crear mensaje de confirmacion de archivo final."),
        lesson("Documentar cambios y cerrar conversacion", "Evitar seguimiento perdido.", "Cada cambio debe tener que cambia, quien autoriza y como afecta fecha o costo.", "Sirve para cuidar tiempos y responsabilidades.", "Se usa durante produccion y postventa.", "Flor debe resumir acuerdo, proximo paso, fecha y responsable.", "No aceptar cambios por audio sin resumen; no cerrar sin siguiente paso.", "Queda confirmado: cambiaremos X, se entrega Y, fecha Z. El siguiente paso es...", ["Cambio", "Autorizacion", "Impacto", "Fecha", "Siguiente paso"], ["Cambios sin registro", "No confirmar entrega", "No dar cierre"], "Cliente pide modificar flyer ya aprobado. Flor confirma cambio, impacto y nueva fecha.", "Documentar 3 cambios de cliente.")
      ],
      activity: activity("Llenar ficha de prospecto y pasar informacion interna.", "Ficha completa + mensaje de escalamiento.", ["Datos completos", "Proximo paso claro", "Responsable definido", "Escalamiento con contexto"]),
      practice: [
        { prompt: "Prospecto: me interesa publicidad, cuanto cuesta?", answer: "Registrar datos, diagnosticar negocio, objetivo, zona, oferta, presupuesto y canal actual." },
        { prompt: "Cliente manda archivo nuevo despues de aprobar.", answer: "Confirmar cambio, documentar version, revisar impacto en tiempo/costo y escalar si aplica." },
        { prompt: "Hay conversaciones sin siguiente paso.", answer: "Actualizar estado, definir accion, fecha y responsable para cada una." }
      ],
      questions: [
        q("Ficha de prospecto debe incluir:", ["Nombre, negocio, telefono, servicio, origen, urgencia, presupuesto, estado, proximo paso y responsable", "Solo nombre", "Solo emoji"], 0),
        q("Escalar a Jad/Jared significa:", ["Enviar contexto completo y duda concreta", "Mandar capturas sin explicar", "Prometer primero"], 0),
        q("Para pedir archivos se debe:", ["Indicar formato y calidad necesarios", "Aceptar cualquier captura", "No revisar"], 0),
        q("Una entrega debe confirmarse con:", ["Archivo/version, fecha y canal", "Silencio", "Solo audio"], 0),
        q("Un cambio debe documentarse con:", ["Que cambia, quien autoriza e impacto", "Nada", "Solo sticker"], 0),
        q("Cerrar conversacion implica:", ["Resumen y siguiente paso", "Desaparecer", "No registrar"], 0),
        q("Para no perder seguimiento se necesita:", ["Estado, fecha y responsable", "Memoria", "Buena suerte"], 0),
        q("Si hay duda tecnica:", ["Escalar antes de prometer", "Improvisar", "Ignorar"], 0),
        q("Nota operativa buena es:", ["Quiere ecommerce para 40 productos, enviar propuesta viernes", "Quiere info", "Pendiente"], 0),
        q("Responsable sirve para:", ["Saber quien da el siguiente paso", "Decorar ficha", "Nada"], 0)
      ]
    }
  ];

  function lesson(title, objective, what, use, when, action, avoid, script, checklist, mistakes, miniCase, exercise) {
    return {
      title: title,
      objective: objective,
      sections: { what: what, use: use, when: when, action: action, avoid: avoid, script: script },
      concepts: [what, use, when, action],
      examples: [miniCase, "Errores a evitar: " + avoid, "Respuesta al cliente: " + script],
      checklist: checklist,
      mistakes: mistakes,
      miniCase: miniCase,
      exercise: exercise
    };
  }

  function activity(instruction, deliverable, criteria) {
    return { instruction: instruction, deliverable: deliverable, criteria: criteria };
  }

  function q(question, answers, correct) {
    return { q: question, a: answers, correct: correct };
  }

  function readProgress() {
    if (remoteProgress) return remoteProgress;
    try {
      return JSON.parse(localStorage.getItem(storageKey()) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeProgress(progress) {
    remoteProgress = progress;
    localStorage.setItem(storageKey(), JSON.stringify(progress));
    registerStudent();
  }

  function currentStudent() {
    var user = window.AdminWebAuth && window.AdminWebAuth.currentUser && window.AdminWebAuth.currentUser();
    return user && user.username ? user.username.toLowerCase() : "local";
  }

  function storageKey() {
    return BASE_STORAGE_KEY + "_" + currentStudent();
  }

  function registerStudent() {
    var username = currentStudent();
    if (username === "local") return;
    var students = [];
    try {
      students = JSON.parse(localStorage.getItem(STUDENT_INDEX_KEY) || "[]");
    } catch (error) {
      students = [];
    }
    if (students.indexOf(username) === -1) {
      students.push(username);
      localStorage.setItem(STUDENT_INDEX_KEY, JSON.stringify(students.sort()));
    }
  }

  function moduleById(id) {
    return modules.filter(function (module) { return module.id === id; })[0] || modules[0];
  }

  function moduleFromPage() {
    var params = new URLSearchParams(window.location.search);
    var queryModule = params.get("modulo");
    if (queryModule) return moduleById(queryModule);
    var bodyModule = document.body.getAttribute("data-module");
    if (bodyModule) return moduleById(bodyModule);
    return modules[0];
  }

  function moduleProgress(moduleId) {
    var progress = readProgress();
    if (!progress[moduleId]) {
      progress[moduleId] = { lessons: {}, practiceDone: false, notes: "", exam: null, updatedAt: null };
    }
    return progress[moduleId];
  }

  function saveModuleProgress(moduleId, nextState) {
    var progress = readProgress();
    var current = moduleProgress(moduleId);
    progress[moduleId] = Object.assign({}, current, nextState, { updatedAt: new Date().toISOString() });
    writeProgress(progress);
    return progress[moduleId];
  }

  function lessonCountDone(module) {
    var item = moduleProgress(module.id);
    return module.lessons.reduce(function (total, lesson, index) {
      return total + (item.lessons[index] ? 1 : 0);
    }, 0);
  }

  function modulePercent(module) {
    var item = moduleProgress(module.id);
    var lessonWeight = Math.round((lessonCountDone(module) / module.lessons.length) * 45);
    var practiceWeight = item.practiceDone ? 20 : 0;
    var examWeight = item.exam ? Math.round((item.exam.percentage / 100) * 35) : 0;
    return Math.min(100, lessonWeight + practiceWeight + examWeight);
  }

  function isApproved(module) {
    var item = moduleProgress(module.id);
    return Boolean(item.exam && item.exam.approved);
  }

  function statusFor(module) {
    var item = moduleProgress(module.id);
    if (item.exam) return { label: item.exam.percentage + "% " + (item.exam.approved ? "aprobado" : "repaso"), className: item.exam.approved ? "approved" : "review" };
    var percent = modulePercent(module);
    if (percent > 0) return { label: percent + "% en curso", className: "" };
    return { label: "Pendiente", className: "" };
  }

  function globalStats() {
    var totalPercent = 0;
    var approved = 0;
    modules.forEach(function (module) {
      totalPercent += modulePercent(module);
      if (isApproved(module)) approved += 1;
    });
    return {
      completed: approved,
      approved: approved,
      total: modules.length,
      general: Math.round(totalPercent / modules.length)
    };
  }

  function nextModule() {
    return modules.filter(function (module) { return !isApproved(module); })[0] || modules[modules.length - 1];
  }

  function nextLessonHref(module) {
    var item = moduleProgress(module.id);
    var pendingIndex = 0;
    module.lessons.some(function (lesson, index) {
      if (!item.lessons[index]) {
        pendingIndex = index;
        return true;
      }
      return false;
    });
    return "curso.html?modulo=" + module.id + "&leccion=" + pendingIndex;
  }

  function renderDashboard() {
    var moduleWrap = document.getElementById("moduleCards");
    var quickWrap = document.getElementById("quickCards");
    var stats = globalStats();
    var pending = nextModule();

    if (moduleWrap) {
      moduleWrap.innerHTML = modules.map(function (module) {
        var status = statusFor(module);
        return [
          '<a class="module-card" href="' + module.href + '">',
          '<span class="status-pill ' + status.className + '">' + status.label + '</span>',
          '<div><h3>' + module.title + '</h3><p>' + module.summary + '</p></div>',
          '<p><strong>' + module.time + '</strong> - ' + lessonCountDone(module) + '/' + module.lessons.length + ' lecciones - ' + (moduleProgress(module.id).practiceDone ? "actividad lista" : "actividad pendiente") + '</p>',
          '<div class="mini-meter"><span style="width:' + modulePercent(module) + '%"></span></div>',
          '<span class="tag">' + module.badge + '</span>',
          '<strong>Entrar al modulo</strong>',
          '</a>'
        ].join("");
      }).join("");
    }

    if (quickWrap) {
      quickWrap.innerHTML = quickLinks.map(function (item) {
        return '<a class="quick-card" href="' + item.href + '"><span class="tag">Acceso rapido</span><div><h3>' + item.title + '</h3><p>' + item.summary + '</p></div><strong>Abrir</strong></a>';
      }).join("");
    }

    setText("completedModules", stats.completed + " / " + stats.total);
    setText("generalProgress", stats.general + "%");
    setText("approvedEvaluations", stats.approved);
    setWidth("generalMeter", stats.general);
    var continueLink = document.getElementById("continueLearning");
    if (continueLink && pending) continueLink.href = nextLessonHref(pending);
    renderRoute();
    renderRecentActivity();
    renderPendingActivities();
    renderBadgeGrid();
    renderEvaluationGrid();
    bindReset();
  }

  function renderPendingActivities() {
    var wrap = document.getElementById("pendingActivities");
    if (!wrap) return;
    var pending = modules.filter(function (module) {
      return !moduleProgress(module.id).practiceDone;
    });
    if (!pending.length) {
      wrap.innerHTML = '<div class="empty-state">Todas las actividades practicas estan terminadas.</div>';
      return;
    }
    wrap.innerHTML = pending.slice(0, 5).map(function (module) {
      return '<a class="activity-item" href="practica.html?modulo=' + module.id + '"><span class="route-number">P</span><span><h3>' + module.title + '</h3><p>' + module.activity.instruction + '</p></span><span class="status-pill review">Pendiente</span></a>';
    }).join("");
  }

  function renderBadgeGrid() {
    var wrap = document.getElementById("badgeGrid");
    if (!wrap) return;
    wrap.innerHTML = modules.map(function (module) {
      var earned = isApproved(module);
      return '<div class="learning-badge ' + (earned ? "" : "locked") + '"><span><strong>' + module.badge + '</strong><br><small>' + module.title + '</small></span><span class="status-pill ' + (earned ? "approved" : "") + '">' + (earned ? "Obtenido" : "Bloqueado") + '</span></div>';
    }).join("");
  }

  function renderEvaluationGrid() {
    var wrap = document.getElementById("evaluationGrid");
    if (!wrap) return;
    wrap.innerHTML = modules.map(function (module) {
      var progress = moduleProgress(module.id);
      var locked = lessonCountDone(module) < module.lessons.length || !progress.practiceDone;
      var status = progress.exam ? (progress.exam.approved ? "Aprobada" : "Repaso") : (locked ? "Bloqueada" : "Lista");
      return '<a class="evaluation-card" href="evaluacion.html?modulo=' + module.id + '"><h3>' + module.title + '</h3><p>' + (progress.exam ? progress.exam.percentage + '% obtenido' : '10 preguntas practicas') + '</p><span class="status-pill ' + (progress.exam && progress.exam.approved ? "approved" : locked ? "" : "review") + '">' + status + '</span></a>';
    }).join("");
  }

  function renderRoute() {
    var wrap = document.getElementById("routeTimeline");
    if (!wrap) return;
    var pending = nextModule();
    wrap.innerHTML = modules.map(function (module, index) {
      var status = statusFor(module);
      var done = isApproved(module);
      var current = pending.id === module.id && !done;
      return [
        '<a class="route-item ' + (done ? "done " : "") + (current ? "current" : "") + '" href="' + module.href + '">',
        '<span class="route-number">' + (done ? "OK" : index + 1) + '</span>',
        '<span><h3>' + module.title + '</h3><p>' + module.time + ' - ' + module.outcome + '</p></span>',
        '<span class="status-pill ' + status.className + '">' + status.label + '</span>',
        '</a>'
      ].join("");
    }).join("");
  }

  function renderRecentActivity() {
    var wrap = document.getElementById("recentActivity");
    if (!wrap) return;
    var progress = readProgress();
    var rows = modules.map(function (module) {
      var item = progress[module.id];
      if (!item || !item.updatedAt) return null;
      return { module: module, item: item };
    }).filter(Boolean).sort(function (a, b) {
      return new Date(b.item.updatedAt).getTime() - new Date(a.item.updatedAt).getTime();
    }).slice(0, 4);

    if (!rows.length) {
      wrap.innerHTML = '<div class="empty-state">Todavia no hay actividad guardada. Cuando Flor complete lecciones, practicas o evaluaciones, aparecera aqui.</div>';
      return;
    }

    wrap.innerHTML = rows.map(function (row) {
      var exam = row.item.exam;
      var label = exam ? (exam.approved ? "Aprobado" : "Repaso") : modulePercent(row.module) + "%";
      return '<div class="activity-item"><span class="route-number">' + modulePercent(row.module) + '</span><span><h3>' + row.module.title + '</h3><p>' + formatDate(row.item.updatedAt) + '</p></span><span class="status-pill ' + (exam && !exam.approved ? "review" : "approved") + '">' + label + '</span></div>';
    }).join("");
  }

  function renderModuleOverview() {
    var root = document.getElementById("moduleOverview");
    if (!root) return;
    var module = moduleFromPage();
    var status = statusFor(module);
    document.title = module.title + " - Universidad Ixmati";
    setText("moduleTitle", module.title);
    setText("moduleSummary", module.summary);
    setText("moduleOutcome", module.outcome);
    setText("moduleTime", module.time);
    setText("moduleLevel", module.level);
    setText("moduleLessons", module.lessons.length + " lecciones");
    setText("moduleStatus", status.label);
    var statusEl = document.getElementById("moduleStatus");
    if (statusEl) statusEl.className = "status-pill " + status.className;
    setWidth("moduleMeter", modulePercent(module));

    root.innerHTML = [
      '<section class="learning-path">',
      module.lessons.map(function (lesson, index) {
        var done = moduleProgress(module.id).lessons[index];
        return '<a class="path-row ' + (done ? "done" : "") + '" href="curso.html?modulo=' + module.id + '&leccion=' + index + '"><span class="route-number">' + (done ? "OK" : index + 1) + '</span><span><h3>' + lesson.title + '</h3><p>' + lesson.objective + '</p></span><strong>Estudiar</strong></a>';
      }).join(""),
      '<a class="path-row" href="practica.html?modulo=' + module.id + '"><span class="route-number">P</span><span><h3>Actividad practica</h3><p>' + module.activity.instruction + '</p></span><strong>Practicar</strong></a>',
      '<a class="path-row" href="evaluacion.html?modulo=' + module.id + '"><span class="route-number">E</span><span><h3>Evaluacion final</h3><p>10 preguntas. Se desbloquea al completar lecciones y actividad.</p></span><strong>Evaluar</strong></a>',
      '</section>'
    ].join("");
    bindModuleCtas(module);
  }

  function renderLessonPage() {
    var root = document.getElementById("lessonRoot");
    if (!root) return;
    var module = moduleFromPage();
    var lessonIndex = Number(new URLSearchParams(window.location.search).get("leccion") || 0);
    lessonIndex = Math.max(0, Math.min(module.lessons.length - 1, lessonIndex));
    var lesson = module.lessons[lessonIndex];
    var progress = moduleProgress(module.id);
    var nextIndex = lessonIndex + 1;
    var nextHref = nextIndex < module.lessons.length ? "curso.html?modulo=" + module.id + "&leccion=" + nextIndex : "practica.html?modulo=" + module.id;
    document.title = lesson.title + " - " + module.title;

    root.innerHTML = [
      pageHeader(module, "Leccion " + (lessonIndex + 1), lesson.title, lesson.objective),
      '<div class="course-layout">',
      sidebar(module, lessonIndex),
      '<article class="content-panel lesson-panel">',
      '<h2>Guia operativa</h2>',
      renderLessonSections(lesson),
      '<h2>Checklist copiable</h2>',
      renderChecklist(lesson),
      '<h2>Errores comunes</h2>',
      '<div class="mistake-grid">' + (lesson.mistakes || []).map(function (mistake) { return '<div class="mistake-card"><h3>Evitar</h3><p>' + mistake + '</p></div>'; }).join("") + '</div>',
      '<h2>Mini caso Ixmati</h2>',
      '<div class="mini-case">' + lesson.miniCase + '</div>',
      '<h2>Ejercicio corto</h2>',
      '<div class="workbench"><p>' + lesson.exercise + '</p><textarea id="lessonNotes" rows="5" placeholder="Escribe aqui tu respuesta de practica...">' + escapeHtml((progress.lessonNotes && progress.lessonNotes[lessonIndex]) || "") + '</textarea><button class="button-link subtle" id="saveLessonNotes" type="button">Guardar notas</button></div>',
      '<div class="module-nav"><a class="button-link" href="' + module.href + '">Volver al modulo</a><button class="button-link primary" id="completeLesson" type="button">' + (progress.lessons[lessonIndex] ? "Leccion completada" : "Marcar y continuar") + '</button></div>',
      '</article>',
      '</div>'
    ].join("");

    bindCopyButtons();
    document.getElementById("saveLessonNotes").addEventListener("click", function () {
      saveLessonNotes(module.id, lessonIndex, document.getElementById("lessonNotes").value);
    });
    document.getElementById("completeLesson").addEventListener("click", function () {
      var item = moduleProgress(module.id);
      item.lessons[lessonIndex] = true;
      saveLessonNotes(module.id, lessonIndex, document.getElementById("lessonNotes").value, item);
      Promise.resolve(ACADEMY_API && ACADEMY_API.saveLesson(module, lessonIndex)).then(function () {
        window.location.href = nextHref;
      });
    });
  }

  function renderLessonSections(lesson) {
    var sections = [
      ["Que es", lesson.sections && lesson.sections.what],
      ["Para que sirve", lesson.sections && lesson.sections.use],
      ["Cuando se usa", lesson.sections && lesson.sections.when],
      ["Que debe hacer", lesson.sections && lesson.sections.action],
      ["Errores a evitar", lesson.sections && lesson.sections.avoid],
      ["Como responder al cliente", lesson.sections && lesson.sections.script]
    ];
    return '<div class="lesson-section-grid">' + sections.map(function (item) {
      return '<section class="lesson-section"><h3>' + item[0] + '</h3><p>' + item[1] + '</p></section>';
    }).join("") + '</div>';
  }

  function renderChecklist(lesson) {
    var text = (lesson.checklist || []).map(function (item) { return "[ ] " + item; }).join("\n");
    return [
      '<div class="resource-card">',
      '<h3>Checklist de trabajo</h3>',
      '<div class="copy-list">',
      (lesson.checklist || []).map(function (item) { return '<label class="copy-line"><input type="checkbox"> <span>' + item + '</span></label>'; }).join(""),
      '</div>',
      '<div class="copy-actions"><button class="button-link subtle" type="button" data-copy-text="' + escapeHtml(text) + '">Copiar checklist</button></div>',
      '</div>'
    ].join("");
  }

  function bindCopyButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy-text]"), function (button) {
      button.addEventListener("click", function () {
        copyToClipboard(button.getAttribute("data-copy-text"));
        button.textContent = "Copiado";
      });
    });
  }

  function renderPracticePage() {
    var root = document.getElementById("practiceRoot");
    if (!root) return;
    var module = moduleFromPage();
    var progress = moduleProgress(module.id);
    document.title = "Practica - " + module.title;
    root.innerHTML = [
      pageHeader(module, "Practica guiada", module.title, "Resuelve escenarios antes de presentar la evaluacion final."),
      '<div class="course-layout">',
      sidebar(module, -1),
      '<article class="content-panel lesson-panel">',
      '<h2>Actividad practica</h2>',
      '<div class="workbench"><p><strong>Instruccion:</strong> ' + module.activity.instruction + '</p><p><strong>Entregable esperado:</strong> ' + module.activity.deliverable + '</p><div class="criteria-list">' + module.activity.criteria.map(function (item) { return '<label class="review-check"><input type="checkbox"> ' + item + '</label>'; }).join("") + '</div><button class="button-link subtle" type="button" data-copy-text="' + escapeHtml(module.activity.criteria.map(function (item) { return "[ ] " + item; }).join("\n")) + '">Copiar criterios</button></div>',
      '<h2>Escenarios de practica</h2>',
      '<div class="scenario-stack">',
      module.practice.map(function (item, index) {
        return '<section class="scenario-card"><p class="eyebrow">Caso ' + (index + 1) + '</p><h3>' + item.prompt + '</h3><textarea rows="4" data-practice-note="' + index + '" placeholder="Escribe como responderias...">' + escapeHtml((progress.practiceNotes && progress.practiceNotes[index]) || "") + '</textarea><button class="button-link subtle reveal-answer" type="button">Ver respuesta modelo</button><div class="model-answer" hidden>' + item.answer + '</div></section>';
      }).join(""),
      '</div>',
      '<div class="workbench"><h2>Checklist antes de evaluar</h2><label class="review-check"><input class="practice-check" type="checkbox"> Entiendo el objetivo del modulo</label><label class="review-check"><input class="practice-check" type="checkbox"> Puedo explicar al cliente cuando aplica</label><label class="review-check"><input class="practice-check" type="checkbox"> Puedo registrar o escalar dudas correctamente</label></div>',
      '<div class="workbench"><h2>Entregable para revision</h2><p>Escribe tu respuesta final o pega un link de apoyo si aplica. Esto se guarda como entrega para SuperSU.</p><textarea id="submissionText" rows="6" placeholder="Describe tu entregable, criterio o respuesta final...">' + escapeHtml((progress.submission && progress.submission.content && progress.submission.content.text) || "") + '</textarea><input id="submissionLink" type="url" placeholder="Link opcional al entregable" value="' + escapeHtml((progress.submission && progress.submission.content && progress.submission.content.link) || "") + '"></div>',
      '<div class="module-nav"><a class="button-link" href="' + module.href + '">Volver al modulo</a><button class="button-link primary" id="completePractice" type="button">' + (progress.practiceDone ? "Practica completada" : "Completar practica") + '</button></div>',
      '</article>',
      '</div>'
    ].join("");

    Array.prototype.forEach.call(document.querySelectorAll(".reveal-answer"), function (button) {
      button.addEventListener("click", function () {
        var answer = button.nextElementSibling;
        answer.hidden = !answer.hidden;
      });
    });
    bindCopyButtons();
    document.getElementById("completePractice").addEventListener("click", function () {
      var notes = {};
      Array.prototype.forEach.call(document.querySelectorAll("[data-practice-note]"), function (field) {
        notes[field.getAttribute("data-practice-note")] = field.value;
      });
      var submission = {
        text: document.getElementById("submissionText").value.trim(),
        link: document.getElementById("submissionLink").value.trim(),
        practiceNotes: notes
      };
      saveModuleProgress(module.id, { practiceDone: true, practiceNotes: notes, submission: { content: submission, status: "submitted", submitted_at: new Date().toISOString() } });
      Promise.resolve(ACADEMY_API && ACADEMY_API.submitActivity(module, submission)).then(function () {
        window.location.href = "evaluacion.html?modulo=" + module.id;
      });
    });
  }

  function renderEvaluationPage() {
    var root = document.getElementById("evaluationRoot");
    if (!root) return;
    var module = moduleFromPage();
    var progress = moduleProgress(module.id);
    var locked = lessonCountDone(module) < module.lessons.length || !progress.practiceDone;
    document.title = "Evaluacion - " + module.title;
    root.innerHTML = [
      pageHeader(module, "Evaluacion final", module.title, "Esta evaluacion se presenta despues de estudiar y practicar el modulo."),
      '<div class="course-layout">',
      sidebar(module, -2),
      '<article class="content-panel lesson-panel">',
      locked ? lockedMessage(module) : evaluationForm(module, progress),
      '</article>',
      '</div>'
    ].join("");
    if (!locked) bindEvaluation(module);
  }

  function pageHeader(module, eyebrow, title, subtitle) {
    return '<section class="hero"><div class="hero-main"><p class="eyebrow">' + eyebrow + '</p><h1>' + title + '</h1><p class="subtitle">' + subtitle + '</p></div><aside class="progress-panel"><p class="eyebrow">Avance</p><div class="kpi"><span>Modulo</span><strong>' + modulePercent(module) + '%</strong></div><div class="meter"><span style="width:' + modulePercent(module) + '%"></span></div><a class="button-link" href="' + module.href + '">Mapa del modulo</a></aside></section>';
  }

  function sidebar(module, activeLesson) {
    return '<aside class="course-sidebar"><a href="' + module.href + '">Mapa</a>' + module.lessons.map(function (lesson, index) {
      return '<a class="' + (activeLesson === index ? "active" : "") + '" href="curso.html?modulo=' + module.id + '&leccion=' + index + '">' + (index + 1) + '. ' + lesson.title + '</a>';
    }).join("") + '<a class="' + (activeLesson === -1 ? "active" : "") + '" href="practica.html?modulo=' + module.id + '">Practica</a><a class="' + (activeLesson === -2 ? "active" : "") + '" href="evaluacion.html?modulo=' + module.id + '">Evaluacion</a></aside>';
  }

  function lockedMessage(module) {
    return '<h2>Evaluacion bloqueada</h2><p>Primero completa todas las lecciones y la practica guiada. Esto evita que Flor brinque directo al examen sin estudiar.</p><div class="score-breakdown"><div class="score-row"><span>Lecciones completadas</span><strong>' + lessonCountDone(module) + ' / ' + module.lessons.length + '</strong></div><div class="score-row"><span>Practica</span><strong>' + (moduleProgress(module.id).practiceDone ? "Completada" : "Pendiente") + '</strong></div></div><a class="button-link primary" href="' + nextLessonHref(module) + '">Continuar estudio</a>';
  }

  function evaluationForm(module, progress) {
    return [
      '<h2>Cuestionario final</h2>',
      '<p>Se aprueba con ' + PASSING_SCORE + '%. El resultado queda guardado en el dashboard.</p>',
      progress.exam ? '<div class="quiz-result ' + (progress.exam.approved ? "approved" : "review") + '" style="display:block">Ultimo resultado: ' + progress.exam.percentage + '%. ' + (progress.exam.approved ? "Aprobado." : "Requiere repaso.") + '</div>' : '',
      '<form class="quiz-form" id="examForm">',
      module.questions.map(function (item, index) {
        return '<fieldset class="question"><p>' + (index + 1) + '. ' + item.q + '</p>' + item.a.map(function (answer, answerIndex) {
          return '<label class="option"><input type="radio" name="q' + index + '" value="' + answerIndex + '" required> <span>' + answer + '</span></label>';
        }).join("") + '</fieldset>';
      }).join(""),
      '<button class="button-link primary" type="submit">Calificar evaluacion</button>',
      '</form><div id="examResult" class="quiz-result"></div>'
    ].join("");
  }

  function bindEvaluation(module) {
    document.getElementById("examForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var correct = module.questions.reduce(function (total, item, index) {
        var selected = document.querySelector('input[name="q' + index + '"]:checked');
        return total + (selected && Number(selected.value) === item.correct ? 1 : 0);
      }, 0);
      var answers = {};
      module.questions.forEach(function (item, index) {
        var selected = document.querySelector('input[name="q' + index + '"]:checked');
        answers[index] = selected ? Number(selected.value) : null;
      });
      var percentage = Math.round((correct / module.questions.length) * 100);
      var exam = { correct: correct, total: module.questions.length, percentage: percentage, approved: percentage >= PASSING_SCORE, completedAt: new Date().toISOString(), answers: answers };
      saveModuleProgress(module.id, { exam: exam });
      Promise.resolve(ACADEMY_API && ACADEMY_API.saveQuizAttempt(module, exam, answers));
      var result = document.getElementById("examResult");
      result.className = "quiz-result " + (exam.approved ? "approved" : "review");
      result.textContent = percentage + "% obtenido. " + (exam.approved ? "Aprobado." : "Requiere repaso.");
    });
  }

  function bindModuleCtas(module) {
    var start = document.getElementById("startModule");
    var practice = document.getElementById("practiceModule");
    var evaluation = document.getElementById("evaluationModule");
    if (start) start.href = nextLessonHref(module);
    if (practice) practice.href = "practica.html?modulo=" + module.id;
    if (evaluation) evaluation.href = "evaluacion.html?modulo=" + module.id;
  }

  function saveLessonNotes(moduleId, lessonIndex, notes, existing) {
    var item = existing || moduleProgress(moduleId);
    var lessonNotes = item.lessonNotes || {};
    lessonNotes[lessonIndex] = notes;
    saveModuleProgress(moduleId, { lessons: item.lessons, lessonNotes: lessonNotes });
  }

  function bindReset() {
    var reset = document.getElementById("resetProgress");
    if (!reset || reset.dataset.bound) return;
    reset.dataset.bound = "true";
    reset.addEventListener("click", function () {
      if (!window.confirm("Esto borrara el progreso local de Flor en este navegador. Continuar?")) return;
      localStorage.removeItem(storageKey());
      renderDashboard();
    });
  }

  function migrateLocalProgressToSupabase() {
    var localProgress = null;
    try {
      localProgress = JSON.parse(localStorage.getItem(storageKey()) || "{}");
    } catch (error) {
      localProgress = {};
    }
    if (!ACADEMY_API || !ACADEMY_API.enabled) return Promise.resolve(false);
    return ACADEMY_API.migrateLocalProgress(modules, localProgress).then(function (ok) {
      if (ok) localStorage.setItem("ixmati_academia_migrated_" + currentStudent(), "ok");
      return ok;
    });
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setWidth(id, value) {
    var el = document.getElementById(id);
    if (el) el.style.width = value + "%";
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
    var field = document.createElement("textarea");
    field.value = text;
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char];
    });
  }

  function markCurrentNav() {
    injectRoleNav();
    var current = (window.location.pathname.split("/").pop() || "academia.html").toLowerCase();
    Array.prototype.forEach.call(document.querySelectorAll(".nav-actions a"), function (link) {
      if ((link.getAttribute("href") || "").toLowerCase() === current) link.setAttribute("aria-current", "page");
    });
  }

  function injectRoleNav() {
    var nav = document.querySelector(".nav-actions");
    if (!nav || nav.dataset.roleNavReady) return;
    nav.dataset.roleNavReady = "true";
    var user = window.AdminWebAuth && window.AdminWebAuth.currentUser && window.AdminWebAuth.currentUser();
    if (user && user.role === "flor" && !nav.querySelector('a[href="produccion-flor.html"]')) {
      nav.insertAdjacentHTML("beforeend", '<a href="produccion-flor.html">Produccion</a>');
    }
  }

  window.migrarUniversidadIxmati = migrateLocalProgressToSupabase;

  document.addEventListener("DOMContentLoaded", function () {
    var boot = ACADEMY_API && ACADEMY_API.enabled ? ACADEMY_API.readRemoteProgress(modules) : Promise.resolve(null);
    boot.then(function (progress) {
      if (progress) {
        remoteProgress = progress;
        writeProgress(progress);
      }
      renderDashboard();
      renderModuleOverview();
      renderLessonPage();
      renderPracticePage();
      renderEvaluationPage();
      markCurrentNav();
    });
  });
})();
