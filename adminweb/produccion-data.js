(function () {
  var STORAGE_KEY = "ixmati_produccion_flor_v1";
  var CUSTOM_OPS_KEY = "ixmati_produccion_custom_ops_v1";
  var API_URL = "api/production.php";
  var remoteLoaded = false;
  var cfg = window.IxmatiSupabaseConfig || {};
  var supabaseEnabled = Boolean(
    window.supabase &&
    cfg.url &&
    cfg.anonKey &&
    cfg.url !== "SUPABASE_URL" &&
    cfg.anonKey !== "SUPABASE_ANON_KEY" &&
    cfg.url.indexOf("TU-PROYECTO") === -1 &&
    cfg.anonKey !== "sb_publishable_..."
  );
  var supabaseClient = supabaseEnabled ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  var supabaseSessionReady = null;
  var supabaseAuthMissing = false;
  var remoteError = "";
  var DELIVERY_BUCKET = "production-deliveries";
  var checklist = ["Diseno terminado", "Revisado", "Programado", "Publicado"];
  var statuses = ["Pendiente", "En diseno", "En revision", "Enviado a aprobacion", "Aprobado", "Cambios solicitados", "Programado", "Publicado"];

  var defaultOps = [
    {
      id: "OP-001",
      page: "op-001.html",
      type: "Carrusel",
      title: "Servicios Digitales Ixmati",
      status: "Pendiente",
      priority: "Alta",
      format: "1080x1350",
      pieces: "7 slides",
      objective: "Presentar la linea completa de servicios digitales Ixmati y abrir conversacion por WhatsApp o website.",
      cta: "Solicita informacion por WhatsApp o visita nuestro website.",
      refs: ["Mockups web", "Pantallas", "Laptop", "Movil", "UI limpia", "Fondos claros"],
      slides: [
        { title: "IXMATI DIGITAL", subtitle: "Impulsamos negocios mediante tecnologia.", text: "Soluciones digitales para vender mejor, ordenar procesos y comunicar con claridad.", visual: "Mockups web, pantallas, laptop y movil." },
        { title: "Redes Sociales", text: "Diseno\nProgramacion\nContenido\nReportes", visual: "Instagram, Facebook y TikTok con composicion tipo dashboard social." },
        { title: "Sitios Web", text: "Tu negocio abierto 24/7.\nCreamos paginas claras, rapidas y listas para recibir clientes.", visual: "Mockup web moderno con hero, boton CTA y vista movil." },
        { title: "Tiendas Online", text: "Vende productos en linea.\nCatalogo, carrito y checkout para pedidos mas ordenados.", visual: "Catalogo, carrito, checkout y tarjeta de producto." },
        { title: "Sistemas", text: "Digitaliza procesos.\nPaneles para administrar informacion, pedidos, citas o reportes.", visual: "Dashboard, graficas y panel administrativo." },
        { title: "Automatizacion", text: "Menos trabajo manual.\nFlujos, IA y bots para ahorrar tiempo operativo.", visual: "Flujos conectados, IA, bots y nodos de automatizacion." },
        { title: "Solicita informacion", text: "Cuentanos que necesita tu negocio.\nTe ayudamos a elegir la solucion correcta.", visual: "CTA con WhatsApp, website y cierre visual de marca." }
      ]
    },
    {
      id: "OP-002",
      page: "op-002.html",
      type: "Carrusel",
      title: "Redes Sociales",
      status: "Pendiente",
      priority: "Alta",
      format: "1080x1350",
      pieces: "7 slides",
      objective: "Explicar que redes sociales no es solo publicar, sino disenar, programar, crear formatos y medir resultados.",
      cta: "Solicita informacion y arma tu plan mensual de redes.",
      refs: ["Feed", "Reels", "Stories", "Calendario editorial", "Metricas"],
      slides: [
        { title: "Tu negocio necesita Redes Sociales?", text: "Si tus clientes te buscan en Instagram, Facebook o TikTok, tu presencia debe verse activa, clara y profesional.", visual: "Collage de publicaciones y perfil social." },
        { title: "Diseno de contenido", text: "Creamos piezas visuales alineadas a tu marca para promociones, servicios, productos y comunicados.", visual: "Plantillas de post, paleta de color y mockup de feed." },
        { title: "Reels", text: "Videos cortos para mostrar productos, procesos, testimonios, promociones y momentos clave de tu negocio.", visual: "Interfaz de reel, timeline y mini clips." },
        { title: "Stories", text: "Contenido rapido para mantener presencia diaria, activar promociones y dirigir clientes a WhatsApp.", visual: "Stories con stickers, encuesta y boton de mensaje." },
        { title: "Programacion", text: "Organizamos el calendario para publicar con constancia sin depender de improvisar cada semana.", visual: "Calendario editorial y lista de publicaciones." },
        { title: "Reportes", text: "Revisamos alcance, interacciones, clics y mensajes para saber que contenido funciona mejor.", visual: "Graficas simples y metricas sociales." },
        { title: "Solicita informacion", text: "Hagamos que tus redes trabajen con estrategia, diseno y seguimiento mensual.", visual: "CTA con WhatsApp y website." }
      ]
    },
    {
      id: "OP-003",
      page: "op-003.html",
      type: "Carrusel",
      title: "Sitios Web",
      status: "Pendiente",
      priority: "Alta",
      format: "1080x1350",
      pieces: "7 slides",
      objective: "Mostrar el valor de una web como punto de venta, confianza y contacto disponible todo el dia.",
      cta: "Solicita informacion para crear tu sitio web.",
      refs: ["Landing", "Web corporativa", "Formulario", "WhatsApp", "Responsive"],
      slides: [
        { title: "Tu negocio abierto 24/7", text: "Un sitio web permite que tus clientes conozcan tus servicios, vean informacion y te contacten a cualquier hora.", visual: "Mockup desktop y movil con pagina principal." },
        { title: "Landing Pages", text: "Paginas enfocadas en una accion: cotizar, agendar, comprar o pedir informacion.", visual: "Landing con hero, beneficios y CTA." },
        { title: "Sitios Corporativos", text: "Presencia profesional para explicar tu empresa, servicios, experiencia y datos de contacto.", visual: "Secciones de empresa, servicios y contacto." },
        { title: "Formularios", text: "Recibe datos ordenados de prospectos, solicitudes, reservas o cotizaciones.", visual: "Formulario limpio con campos y confirmacion." },
        { title: "WhatsApp", text: "Conecta tu pagina a mensajes directos para que el cliente pueda dar el siguiente paso rapido.", visual: "Boton WhatsApp y conversacion iniciada." },
        { title: "Beneficios", text: "Mas confianza, informacion clara, mejor seguimiento y menos preguntas repetidas.", visual: "Iconos de confianza, velocidad, contacto y orden." },
        { title: "Solicita informacion", text: "Creamos la web que tu negocio necesita para vender, informar o agendar.", visual: "CTA con WhatsApp y website." }
      ]
    },
    {
      id: "OP-004",
      page: "op-004.html",
      type: "Carrusel",
      title: "Tiendas Online",
      status: "Pendiente",
      priority: "Media",
      format: "1080x1350",
      pieces: "7 slides",
      objective: "Explicar como una tienda online ordena catalogo, productos, carrito, pagos y pedidos.",
      cta: "Solicita informacion para vender en linea.",
      refs: ["Catalogo", "Producto", "Carrito", "Checkout", "Pagos"],
      slides: [
        { title: "Vende en linea", text: "Convierte tu catalogo en una experiencia clara para que tus clientes vean, elijan y pidan sin desorden.", visual: "Tienda online en laptop y movil." },
        { title: "Catalogo", text: "Muestra tus productos por categorias, colecciones, tallas, colores o disponibilidad.", visual: "Grid de productos y filtros." },
        { title: "Productos", text: "Cada producto puede tener fotos, descripcion, precio, variantes y detalles importantes.", visual: "Ficha de producto moderna." },
        { title: "Carrito", text: "El cliente agrega productos y revisa su pedido antes de enviarlo o pagarlo.", visual: "Carrito lateral con resumen." },
        { title: "Pagos", text: "Integra pago en linea o flujo de confirmacion segun la operacion de tu negocio.", visual: "Checkout, tarjeta y confirmacion." },
        { title: "Beneficios", text: "Pedidos mas claros, menos mensajes repetidos y una forma mas profesional de vender.", visual: "Iconos de orden, venta, rapidez y control." },
        { title: "Solicita informacion", text: "Armemos una tienda online adaptada a tus productos y proceso de venta.", visual: "CTA con WhatsApp y website." }
      ]
    },
    {
      id: "OP-005",
      page: "op-detalle.html?id=OP-005",
      type: "POST servicio",
      calendarType: "Producto",
      dueDate: "8 julio 2026",
      title: "Pagina web para tu negocio",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      publishUrl: "ixmatiestudio.com",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Hacer un post facil de entender para que negocios locales vean que una pagina web les ayuda a verse profesionales, recibir clientes y explicar sus servicios sin repetir todo por mensaje.",
      simpleBrief: "La idea es vender el servicio de paginas web sin sonar tecnico. Piensa en un dueno de negocio que pregunta: para que quiero una pagina si ya tengo Facebook? El post debe responder eso en palabras simples.",
      cta: "Manda mensaje y te decimos que tipo de pagina necesita tu negocio.",
      refs: ["Laptop con web abierta", "Celular con version movil", "Boton de WhatsApp", "Negocio local", "Diseno limpio"],
      instructions: [
        "Haz una composicion clara: titulo grande, mockup de pagina web y 3 beneficios faciles de leer.",
        "No llenes el post de texto. Usa frases cortas: Da confianza, Explica tus servicios, Recibe mensajes.",
        "El cliente debe entender en 3 segundos que Ixmati hace paginas web para negocios.",
        "Usa colores sobrios y profesionales. Evita que parezca promocion barata."
      ],
      examples: [
        "Titulo posible: Tu negocio necesita una pagina web?",
        "Texto de apoyo: Presenta tus servicios, genera confianza y recibe clientes desde internet.",
        "Beneficios: Informacion clara / Contacto por WhatsApp / Disponible 24/7."
      ],
      deliverableGuide: "Sube 1 imagen final en PNG o JPG. Si trabajas en Canva/Illustrator, sube tambien captura o archivo editable si puedes.",
      avoid: ["No uses palabras como hosting, dominio, SEO tecnico o UX.", "No pongas demasiado texto pequeno.", "No uses mockups borrosos o pantallas inventadas que no se entiendan."],
      slides: [
        { title: "Post unico", text: "Tu negocio necesita una pagina web?\nPresenta tus servicios, genera confianza y recibe clientes desde internet.\nDisponible 24/7.", visual: "Mockup de laptop y celular mostrando una web limpia, con boton de WhatsApp visible y 3 beneficios alrededor." }
      ]
    },
    {
      id: "OP-006",
      page: "op-detalle.html?id=OP-006",
      type: "REEL proyecto",
      calendarType: "Trabajo realizado",
      dueDate: "10 julio 2026",
      title: "Website Nissan Tulancingo",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar como trabajo realizado el website gustavomolinanissan.com para reforzar confianza: Ixmati ya ha desarrollado proyectos serios para marcas reconocibles.",
      simpleBrief: "Este reel se hace explorando gustavomolinanissan.com. No es para explicar todo el proyecto. Es para que la gente vea rapido: hicimos un website real, se ve profesional, funciona en celular y computadora, y podemos hacer algo asi para otros negocios.",
      cta: "Quieres una web profesional para tu negocio? Escribenos.",
      refs: ["gustavomolinanissan.com", "Grabacion de pantalla", "Scroll de pagina", "Mockup laptop", "Mockup celular", "Logo/proyecto Nissan Tulancingo"],
      instructions: [
        "Hazlo como reel de portafolio: rapido, limpio y con orgullo profesional.",
        "Empieza con un gancho de 2 segundos: Website desarrollado para Nissan Tulancingo.",
        "Abre gustavomolinanissan.com y muestra 3 escenas: vista desktop, vista movil y detalle de una seccion importante.",
        "Cierra con Ixmati puede desarrollar la web de tu negocio."
      ],
      examples: [
        "Texto en pantalla 1: Website desarrollado para Nissan Tulancingo.",
        "Texto en pantalla 2: Diseno claro, responsive y enfocado en informacion util.",
        "Texto en pantalla 3: Tu negocio tambien puede tener una presencia profesional."
      ],
      deliverableGuide: "Sube video MP4 vertical 1080x1920. Si no tienes video, sube storyboard con capturas y notas de animacion.",
      avoid: ["No uses musica que tape el mensaje.", "No metas demasiadas transiciones.", "No uses pantallas borrosas, cortadas o secciones que se vean incompletas."],
      slides: [
        { title: "Escena 1", text: "Website desarrollado para Nissan Tulancingo", visual: "Abrir gustavomolinanissan.com y mostrar portada en laptop o mockup principal." },
        { title: "Escena 2", text: "Vista clara en computadora y celular", visual: "Scroll corto de gustavomolinanissan.com mostrando desktop y mobile." },
        { title: "Escena 3", text: "Un sitio profesional ayuda a informar y generar confianza", visual: "Detalle de una seccion importante del sitio publico." },
        { title: "Escena 4", text: "Tu negocio tambien puede tener una web profesional", visual: "Cierre con marca Ixmati y CTA." }
      ]
    },
    {
      id: "OP-007",
      page: "op-detalle.html?id=OP-007",
      type: "POST servicio",
      calendarType: "Producto",
      dueDate: "12 julio 2026",
      title: "Herramientas que te ahorran tiempo y trabajo",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promocionar sistemas, automatizaciones y herramientas digitales de Ixmati como soluciones para ahorrar tiempo operativo en negocios.",
      simpleBrief: "No lo hagas sonar como programacion complicada. La idea es: si el negocio hace tareas repetidas todos los dias, Ixmati puede crear herramientas para que tarde menos y se equivoque menos.",
      cta: "Cuentanos que tarea repites todos los dias y vemos como automatizarla.",
      refs: ["Dashboard simple", "Checklist digital", "Automatizacion", "Calendario", "Formulario", "Bot"],
      instructions: [
        "Haz un post de servicio con enfoque en dolor real: mucho mensaje, mucho Excel, mucho copiar y pegar.",
        "Muestra antes/despues: antes todo manual, despues una herramienta ordenada.",
        "Usa iconos simples: formulario, alerta, grafica, calendario, WhatsApp.",
        "Debe sentirse util, no futurista ni complicado."
      ],
      examples: [
        "Titulo posible: Herramientas que te ahorran tiempo y trabajo.",
        "Texto de apoyo: Automatiza registros, pedidos, recordatorios o reportes.",
        "Mini beneficios: Menos errores / Mas orden / Menos tareas repetidas."
      ],
      deliverableGuide: "Sube 1 imagen final en PNG o JPG.",
      avoid: ["No uses robots futuristas como tema principal.", "No expliques codigo.", "No prometas que todo se automatiza sin revisar el proceso."],
      slides: [
        { title: "Post unico", text: "Herramientas que te ahorran tiempo y trabajo.\nAutomatiza registros, pedidos, recordatorios o reportes.\nMenos errores, mas orden y menos tareas repetidas.", visual: "Antes/despues: lado izquierdo tareas manuales, lado derecho dashboard/herramienta simple." }
      ]
    },
    {
      id: "OP-008",
      page: "op-detalle.html?id=OP-008",
      type: "POST institucional",
      calendarType: "Producto",
      dueDate: "15 julio 2026",
      title: "Visita nuestro nuevo sitio web",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      publishUrl: "ixmatiestudio.com",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Invitar a la audiencia a visitar el nuevo sitio web de Ixmati y posicionarlo como punto central para conocer servicios, proyectos y contacto.",
      simpleBrief: "Este post es institucional. No vendas un servicio en especifico; presenta el nuevo sitio como la casa digital de Ixmati. Debe verse limpio, confiable y actual.",
      cta: "Visita nuestro sitio web y conoce lo que podemos crear para tu negocio.",
      refs: ["Website Ixmati", "Mockup desktop", "Mockup mobile", "Servicios", "Portafolio", "Contacto"],
      instructions: [
        "Usa el sitio web de Ixmati como protagonista visual.",
        "Muestra que ahi pueden ver servicios, proyectos y formas de contacto.",
        "Hazlo elegante y directo. Menos texto, mas presencia de marca.",
        "Incluye una flecha o boton visual que diga Visitar sitio web."
      ],
      examples: [
        "Titulo posible: Ya puedes visitar nuestro nuevo sitio web.",
        "Texto de apoyo: Conoce nuestros servicios, proyectos y soluciones digitales.",
        "Cierre: Ixmati - tecnologia y diseno para negocios."
      ],
      deliverableGuide: "Sube 1 imagen final en PNG o JPG.",
      avoid: ["No hagas un collage saturado.", "No uses capturas pequenas ilegibles.", "No metas todos los servicios con mucho texto."],
      slides: [
        { title: "Post unico", text: "Ya puedes visitar nuestro nuevo sitio web.\nConoce nuestros servicios, proyectos y soluciones digitales.\nVisita Ixmati y descubre como podemos ayudarte.", visual: "Mockup grande del sitio Ixmati en desktop y mobile con fondo limpio y CTA visible." }
      ]
    },
    {
      id: "OP-009",
      page: "op-detalle.html?id=OP-009",
      type: "REEL proyecto",
      calendarType: "Trabajo realizado",
      dueDate: "17 julio 2026",
      title: "Website Gerokally",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar el website gerokally.org como proyecto realizado, destacando diseno, claridad de informacion y adaptacion a celular.",
      simpleBrief: "Hazlo como un caso de trabajo realizado explorando gerokally.org. La meta es que otros clientes vean que Ixmati puede tomar una marca/negocio y convertirlo en una web profesional y presentable.",
      cta: "Quieres mostrar tu negocio con una web profesional? Hablemos.",
      refs: ["gerokally.org", "Grabacion de pantalla", "Scroll web", "Mockup celular", "Mockup laptop", "Marca Gerokally"],
      instructions: [
        "Usa formato reel vertical con ritmo claro.",
        "Primera pantalla: Website Gerokally por Ixmati.",
        "Abre gerokally.org y muestra la portada, una seccion interior y la vista movil.",
        "Cierra con CTA para negocios que quieren web."
      ],
      examples: [
        "Texto en pantalla 1: Website Gerokally.",
        "Texto en pantalla 2: Una presencia digital clara y profesional.",
        "Texto en pantalla 3: Diseno adaptable para celular y computadora."
      ],
      deliverableGuide: "Sube video MP4 vertical 1080x1920. Si todavia no tienes capturas finales, sube preview con notas.",
      avoid: ["No uses capturas borrosas.", "No aceleres tanto el scroll que no se entienda.", "No uses pantallas cortadas, secciones incompletas o capturas donde no se aprecie el sitio."],
      slides: [
        { title: "Escena 1", text: "Website Gerokally", visual: "Abrir gerokally.org y mostrar portada del sitio en mockup vertical." },
        { title: "Escena 2", text: "Diseno claro para presentar la marca", visual: "Scroll de secciones principales de gerokally.org." },
        { title: "Escena 3", text: "Adaptado para celular y computadora", visual: "Comparativa desktop/mobile." },
        { title: "Escena 4", text: "Tu negocio tambien puede tener una web profesional", visual: "Cierre con Ixmati y CTA." }
      ]
    },
    {
      id: "OP-010",
      page: "op-detalle.html?id=OP-010",
      type: "POST servicio",
      calendarType: "Producto",
      dueDate: "19 julio 2026",
      title: "Publicidad digital para conseguir mas clientes",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      publishUrl: "ixmatiestudio.com",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promocionar publicidad digital como servicio para conseguir mas clientes, mensajes o ventas, sin prometer resultados irreales.",
      simpleBrief: "El post debe explicar que la publicidad digital ayuda a que mas personas correctas vean el negocio. No prometas ventas garantizadas. Enfocate en estrategia, segmentacion, anuncios y seguimiento.",
      cta: "Solicita una estrategia de publicidad digital para tu negocio.",
      refs: ["Meta Ads", "Google Ads", "Cliente enviando mensaje", "Grafica simple", "Segmentacion", "Anuncio en celular"],
      instructions: [
        "Haz un post claro: publicidad digital = mostrar tu negocio a personas que pueden comprar.",
        "Usa visual de celular con anuncio y una grafica simple de crecimiento.",
        "Incluye 3 ideas: estrategia, segmentacion y seguimiento.",
        "Debe sonar confiable, no milagroso."
      ],
      examples: [
        "Titulo posible: Publicidad digital para conseguir mas clientes.",
        "Texto de apoyo: Creamos anuncios para que mas personas conozcan tu negocio y te contacten.",
        "Beneficios: Mas visibilidad / Mejor segmentacion / Seguimiento de resultados."
      ],
      deliverableGuide: "Sube 1 imagen final en PNG o JPG.",
      avoid: ["No prometas ventas garantizadas.", "No uses billetes o frases tipo hazte rico.", "No pongas graficas irreales o exageradas."],
      slides: [
        { title: "Post unico", text: "Publicidad digital para conseguir mas clientes.\nAnuncios con estrategia, segmentacion y seguimiento.\nHaz que mas personas conozcan tu negocio.", visual: "Celular con anuncio, grafica simple y 3 beneficios alrededor." }
      ]
    },
    {
      id: "OP-011",
      page: "op-detalle.html?id=OP-011",
      type: "REEL instalación",
      calendarType: "Trabajo realizado",
      dueDate: "9 julio 2026",
      title: "Colocación de letras 3D para fachada",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar una colocación de letras 3D como servicio fuerte de Ixmati tradicional, destacando presencia, visibilidad y acabado profesional en fachada.",
      simpleBrief: "Hazlo como reel de instalación con antes, proceso y resultado. Este contenido debe vender colocación, no solo diseño de letras.",
      cta: "Cotiza letras 3D con instalación para tu negocio.",
      refs: ["Fachada comercial", "Letras 3D", "Instalación", "Antes y después", "Negocio local"],
      instructions: [
        "Empieza con la fachada antes de colocar las letras.",
        "Muestra el proceso de medición, alineación o instalación sin hacerlo técnico.",
        "Cierra con el resultado final desde calle y un detalle de volumen.",
        "Haz énfasis en presencia, visibilidad y confianza para el negocio."
      ],
      examples: [
        "Texto en pantalla: De fachada simple a marca visible.",
        "Texto en pantalla: Letras 3D con instalación.",
        "Texto en pantalla: Haz que tu negocio se vea profesional desde afuera."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview de instalación con antes/después.",
      avoid: ["No muestres una fachada sin permiso.", "No uses tomas movidas o oscuras.", "No prometas iluminación si no está incluida en la cotización."],
      slides: [
        { title: "Escena 1", text: "Antes de la colocación", visual: "Fachada limpia antes de instalar letras 3D." },
        { title: "Escena 2", text: "Proceso de instalación", visual: "Alineación, medición o colocación de letras." },
        { title: "Escena 3", text: "Resultado final", visual: "Fachada terminada con letras 3D visibles." },
        { title: "Escena 4", text: "Cotiza tu fachada", visual: "Cierre con marca Ixmati y CTA." }
      ]
    },
    {
      id: "OP-012",
      page: "op-detalle.html?id=OP-012",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "11 julio 2026",
      title: "Anuncios luminosos para negocios",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promover anuncios luminosos como una solución de alto impacto para negocios que necesitan verse mejor de día y de noche.",
      simpleBrief: "Este post debe sentirse fuerte y comercial. Lo importante es vender visibilidad, presencia y profesionalismo en fachada.",
      cta: "Cotiza tu anuncio luminoso para fachada.",
      refs: ["Anuncio luminoso", "Caja de luz", "Fachada nocturna", "Logo iluminado", "Negocio visible"],
      instructions: [
        "Usa un visual de fachada con anuncio encendido.",
        "Incluye beneficios cortos: visibilidad, presencia y recordación.",
        "Menciona que se cotiza según medida, material e instalación.",
        "Haz que el anuncio se vea como inversión para negocios, no como decoración."
      ],
      examples: [
        "Título posible: Que tu negocio también se vea de noche.",
        "Texto de apoyo: Anuncios luminosos para fachadas comerciales.",
        "CTA: Cotiza medida e instalación."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses efectos exagerados de brillo.", "No prometas precio fijo sin medidas.", "No pongas demasiado texto sobre la fachada."],
      slides: [
        { title: "Post único", text: "Anuncios luminosos para negocios.\nHaz que tu fachada se vea profesional, visible y lista para atraer clientes.", visual: "Fachada con anuncio luminoso encendido y CTA de cotización." }
      ]
    },
    {
      id: "OP-013",
      page: "op-detalle.html?id=OP-013",
      type: "REEL instalación",
      calendarType: "Trabajo realizado",
      dueDate: "13 julio 2026",
      title: "Instalación de lona microperforada",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar la instalación de lona microperforada para vitrinas o fachadas, explicando su utilidad para comunicar hacia afuera y conservar privacidad.",
      simpleBrief: "Hazlo visual y práctico: superficie, colocación, resultado final. Debe vender instalación y material aplicado en negocio real.",
      cta: "Cotiza lona microperforada para tu negocio.",
      refs: ["Microperforado", "Vitrina", "Instalación", "Privacidad", "Fachada"],
      instructions: [
        "Muestra la vitrina antes de instalar.",
        "Incluye toma de aplicación o alisado del material.",
        "Graba el resultado desde fuera y desde dentro si se puede.",
        "Cierra explicando que sirve para promociones, imagen y privacidad."
      ],
      examples: [
        "Texto en pantalla: Tus ventanas pueden vender.",
        "Texto en pantalla: Microperforado para fachadas y vitrinas.",
        "Texto en pantalla: Imagen hacia afuera, privacidad hacia adentro."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview de instalación.",
      avoid: ["No uses tomas donde no se entienda el material.", "No tapes datos sensibles del negocio si aparecen.", "No lo confundas con lona normal."],
      slides: [
        { title: "Escena 1", text: "Antes de instalar", visual: "Vitrina o ventana sin aplicación." },
        { title: "Escena 2", text: "Aplicación del microperforado", visual: "Proceso de colocación del material." },
        { title: "Escena 3", text: "Resultado desde calle", visual: "Fachada terminada con gráfica visible." },
        { title: "Escena 4", text: "Cotiza tu instalación", visual: "CTA con ejemplos de uso." }
      ]
    },
    {
      id: "OP-014",
      page: "op-detalle.html?id=OP-014",
      type: "REEL proceso",
      calendarType: "Proceso",
      dueDate: "14 julio 2026",
      title: "Corte láser en acrílico para piezas premium",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar el proceso de corte láser en acrílico como una solución precisa para placas, nombres, displays, letreros y piezas personalizadas.",
      simpleBrief: "El reel debe sentirse satisfactorio: diseño, corte, detalle y pieza terminada. Enfócalo en calidad y acabado premium.",
      cta: "Cotiza piezas en acrílico cortadas a láser.",
      refs: ["Corte láser", "Acrílico", "Placas", "Displays", "Pieza terminada"],
      instructions: [
        "Empieza con el láser trabajando sobre acrílico.",
        "Muestra detalle del borde o forma terminada.",
        "Incluye usos comerciales: placas, nombres, displays o señalética.",
        "Cierra con CTA para cotizar medidas y diseño."
      ],
      examples: [
        "Texto en pantalla: Del diseño a una pieza real.",
        "Texto en pantalla: Corte láser en acrílico.",
        "Texto en pantalla: Acabados limpios para tu marca."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview del proceso.",
      avoid: ["No grabes con reflejos que oculten el corte.", "No uses lenguaje demasiado técnico.", "No prometas espesores sin confirmar material."],
      slides: [
        { title: "Escena 1", text: "Corte láser en acrílico", visual: "Láser cortando acrílico." },
        { title: "Escena 2", text: "Detalle del acabado", visual: "Close-up de borde o pieza cortada." },
        { title: "Escena 3", text: "Aplicaciones comerciales", visual: "Placa, display o nombre en acrílico." },
        { title: "Escena 4", text: "Cotiza tu pieza", visual: "Cierre con CTA." }
      ]
    },
    {
      id: "OP-015",
      page: "op-detalle.html?id=OP-015",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "16 julio 2026",
      title: "Letras 3D para fachadas comerciales",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Mostrar cómo las letras 3D ayudan a que un negocio se vea más profesional, visible y recordable desde la calle.",
      simpleBrief: "Enfoca el post en presencia de marca para fachada. Debe sentirse premium pero accesible para negocios locales.",
      cta: "Cotiza letras 3D para tu fachada o interior.",
      refs: ["Fachada comercial", "Letras volumétricas", "Logo 3D", "Instalación", "Negocio local"],
      instructions: [
        "Haz protagonista una fachada con letras 3D.",
        "Usa 3 beneficios cortos: visibilidad, presencia, confianza.",
        "Muestra que puede ser para exterior o interior.",
        "Cierra con CTA para cotizar por medida y material."
      ],
      examples: [
        "Título posible: Que tu negocio se vea desde afuera.",
        "Beneficios: Más presencia / Mejor imagen / Marca visible.",
        "CTA: Cotiza tus letras 3D."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses fachada genérica sin contexto.", "No pongas texto demasiado pequeño.", "No prometas iluminación si no se cotiza aparte."],
      slides: [
        { title: "Post único", text: "Letras 3D para fachadas comerciales.\nDale presencia, visibilidad y una imagen más profesional a tu negocio.", visual: "Fachada con letras 3D, detalle de volumen y CTA." }
      ]
    },
    {
      id: "OP-016",
      page: "op-detalle.html?id=OP-016",
      type: "CARRUSEL educativo",
      calendarType: "Servicio",
      dueDate: "18 julio 2026",
      title: "Señalética para negocios y oficinas",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "5 slides",
      objective: "Explicar cómo la señalética ayuda a orientar clientes, ordenar espacios y reforzar la imagen profesional de un negocio.",
      simpleBrief: "Haz un carrusel educativo y fácil de leer. La idea no es vender una pieza aislada, sino mostrar que la señalética mejora la experiencia dentro del local u oficina.",
      cta: "Cotiza señalética personalizada para tu negocio.",
      refs: ["Señales interiores", "Oficinas", "Recepción", "Flechas", "Iconos de servicios"],
      instructions: [
        "Abre con una pregunta clara sobre si los clientes encuentran rápido lo que buscan.",
        "Explica 3 usos: orientar, identificar áreas y reforzar marca.",
        "Usa ejemplos visuales de recepción, baños, cajas, rutas o áreas internas.",
        "Cierra invitando a cotizar señalética a medida."
      ],
      examples: [
        "Slide 1: Tu negocio también comunica con sus señales.",
        "Slide 2: Ayuda a orientar a tus clientes.",
        "Slide 3: Refuerza una imagen más ordenada y profesional."
      ],
      deliverableGuide: "Sube carrusel en PNG/JPG por slide o preview completo.",
      avoid: ["No hagas señales genéricas sin marca.", "No uses demasiados iconos juntos.", "No llenes cada slide de texto."],
      slides: [
        { title: "Tu espacio también comunica", text: "La señalética ayuda a que tus clientes se orienten mejor y perciban más orden.", visual: "Entrada o recepción con señales claras." },
        { title: "Ubica áreas importantes", text: "Caja, recepción, baños, salidas, oficinas o puntos de atención.", visual: "Set de señales interiores con iconos simples." },
        { title: "Refuerza tu marca", text: "Colores, materiales y diseño pueden alinearse con la identidad del negocio.", visual: "Señales con paleta de marca aplicada." },
        { title: "Mejora la experiencia", text: "Menos dudas, mejor recorrido y una imagen más profesional.", visual: "Cliente guiándose dentro de un local." },
        { title: "Cotiza tu señalética", text: "Creamos señales personalizadas para negocios, oficinas y espacios comerciales.", visual: "Cierre con ejemplos de señalética y marca Ixmati." }
      ]
    },
    {
      id: "OP-017",
      page: "op-detalle.html?id=OP-017",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "20 julio 2026",
      title: "Acrílicos para mostradores y puntos de venta",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promover piezas en acrílico para mostradores, exhibidores, placas, menús y puntos de venta que necesitan verse limpios y profesionales.",
      simpleBrief: "El post debe vender acrílico como material premium para negocios físicos. Usa ejemplos de aplicación en mostrador o local.",
      cta: "Cotiza piezas en acrílico para tu negocio.",
      refs: ["Display acrílico", "Mostrador", "Placas", "Menú", "Punto de venta"],
      instructions: [
        "Muestra una pieza en acrílico aplicada en mostrador o punto de venta.",
        "Incluye usos concretos: exhibidores, placas, menús, señalética o nombres.",
        "Haz énfasis en limpieza visual y acabado profesional.",
        "Cierra con CTA por medida y diseño."
      ],
      examples: [
        "Título posible: Acrílico que eleva tu punto de venta.",
        "Texto de apoyo: Displays, placas y piezas personalizadas.",
        "CTA: Cotiza por medida."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses fondo saturado.", "No muestres acrílico rayado o sucio.", "No prometas espesores sin validar material."],
      slides: [
        { title: "Post único", text: "Acrílicos para mostradores y puntos de venta.\nDisplays, placas y piezas personalizadas con acabado limpio y profesional.", visual: "Pieza acrílica aplicada en mostrador con CTA." }
      ]
    },
    {
      id: "OP-018",
      page: "op-detalle.html?id=OP-018",
      type: "REEL instalación",
      calendarType: "Trabajo realizado",
      dueDate: "21 julio 2026",
      title: "Colocación de anuncio luminoso",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar la colocación de un anuncio luminoso como trabajo de alto valor, destacando proceso, seguridad visual y resultado final.",
      simpleBrief: "Este reel debe vender instalación profesional. Muestra preparación, montaje y resultado encendido.",
      cta: "Cotiza la fabricación e instalación de tu anuncio.",
      refs: ["Anuncio luminoso", "Instalación", "Fachada", "Montaje", "Resultado encendido"],
      instructions: [
        "Inicia con el anuncio listo para instalar o la fachada antes.",
        "Muestra momentos de colocación sin detalles riesgosos.",
        "Incluye resultado final de día y, si se puede, encendido.",
        "Cierra con CTA para cotización completa."
      ],
      examples: [
        "Texto en pantalla: Un anuncio bien colocado cambia tu fachada.",
        "Texto en pantalla: Fabricación e instalación.",
        "Texto en pantalla: Haz visible tu negocio."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview de instalación.",
      avoid: ["No muestres maniobras inseguras.", "No uses tomas donde no se vea el anuncio completo.", "No prometas tiempos sin revisar proyecto."],
      slides: [
        { title: "Escena 1", text: "Antes de instalar", visual: "Fachada o anuncio listo para colocación." },
        { title: "Escena 2", text: "Montaje", visual: "Proceso de instalación del anuncio." },
        { title: "Escena 3", text: "Resultado final", visual: "Anuncio colocado y visible." },
        { title: "Escena 4", text: "Cotiza tu anuncio", visual: "CTA con marca Ixmati." }
      ]
    },
    {
      id: "OP-019",
      page: "op-detalle.html?id=OP-019",
      type: "REEL instalación",
      calendarType: "Trabajo realizado",
      dueDate: "22 julio 2026",
      title: "Rotulación vehicular para empresas",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar cómo un vehículo rotulado funciona como publicidad móvil y ayuda a que la marca se vea en ruta.",
      simpleBrief: "Hazlo como reel de instalación o antes/después. Debe verse el cambio visual del vehículo y el beneficio para empresas.",
      cta: "Cotiza la rotulación de tu unidad.",
      refs: ["Vehículo antes y después", "Vinil aplicado", "Detalle de rotulación", "Logo en puerta"],
      instructions: [
        "Empieza con el vehículo antes de rotular.",
        "Muestra detalles del proceso de aplicación.",
        "Incluye el resultado final desde varios ángulos.",
        "Cierra con la idea de publicidad móvil."
      ],
      examples: [
        "Texto en pantalla: Tu unidad también puede vender.",
        "Texto en pantalla: Rotulación vehicular para empresas.",
        "Texto en pantalla: Marca visible en cada recorrido."
      ],
      deliverableGuide: "Sube video MP4 vertical o preview de instalación.",
      avoid: ["No muestres placas si no es necesario.", "No uses tomas con reflejos fuertes.", "No prometas durabilidad sin especificar material."],
      slides: [
        { title: "Escena 1", text: "Antes de rotular", visual: "Vehículo limpio antes de aplicar vinil." },
        { title: "Escena 2", text: "Aplicación del vinil", visual: "Manos instalando o alisando vinil." },
        { title: "Escena 3", text: "Marca visible en ruta", visual: "Resultado final del vehículo rotulado." },
        { title: "Escena 4", text: "Cotiza tu rotulación vehicular", visual: "Cierre con CTA y datos visuales de Ixmati." }
      ]
    },
    {
      id: "OP-020",
      page: "op-detalle.html?id=OP-020",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "23 julio 2026",
      title: "Placas y logotipos en acrílico para interiores",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promover placas y logotipos en acrílico para recepción, oficinas, consultorios y espacios interiores.",
      simpleBrief: "Hazlo premium y claro. La idea es vender presencia de marca dentro del espacio, especialmente recepción y oficinas.",
      cta: "Cotiza tu logo o placa en acrílico.",
      refs: ["Logo acrílico", "Recepción", "Oficina", "Placa", "Interior comercial"],
      instructions: [
        "Muestra logo o placa colocada en interior.",
        "Incluye usos: recepción, sala de juntas, consultorio, mostrador.",
        "Habla de acabado limpio y personalizado.",
        "Cierra con CTA por medida y diseño."
      ],
      examples: [
        "Título posible: Tu marca también debe verse por dentro.",
        "Texto de apoyo: Placas y logotipos en acrílico para interiores.",
        "CTA: Cotiza a medida."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses mockup falso si hay material real.", "No satures con muchos tipos de acrílico.", "No prometas instalación incluida sin confirmarlo."],
      slides: [
        { title: "Post único", text: "Placas y logotipos en acrílico para interiores.\nDale presencia profesional a tu recepción, oficina o consultorio.", visual: "Logo en acrílico instalado en pared interior." }
      ]
    },
    {
      id: "OP-021",
      page: "op-detalle.html?id=OP-021",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "24 julio 2026",
      title: "Uniformes personalizados para negocios",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Comunicar que los uniformes personalizados ayudan a proyectar orden, confianza y profesionalismo en equipos de trabajo.",
      simpleBrief: "El post debe hablar de imagen de equipo, no solo de playeras. Usa ejemplos de negocios y atención al cliente.",
      cta: "Cotiza uniformes personalizados para tu equipo.",
      refs: ["Playeras con logo", "Equipo de trabajo", "Bordado o vinil textil", "Negocio local"],
      instructions: [
        "Muestra un equipo o grupo con uniforme consistente.",
        "Incluye beneficios: identificación, confianza y presencia.",
        "Menciona que se pueden personalizar prendas según necesidad.",
        "Cierra con CTA para cotizar cantidades."
      ],
      examples: [
        "Título posible: Tu equipo también comunica.",
        "Texto de apoyo: Uniformes personalizados para negocios.",
        "Beneficios: Orden / Confianza / Imagen profesional."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses mockups que parezcan tienda de ropa genérica.", "No prometas técnica específica sin validar material.", "No llenes el post con lista larga de prendas."],
      slides: [
        { title: "Post único", text: "Uniformes personalizados para negocios.\nProyecta orden, confianza e identidad con prendas para tu equipo.", visual: "Equipo con playeras o uniformes con logo aplicado." }
      ]
    },
    {
      id: "OP-022",
      page: "op-detalle.html?id=OP-022",
      type: "REEL proceso",
      calendarType: "Proceso",
      dueDate: "25 julio 2026",
      title: "Fabricación de caja de luz para fachada",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar el proceso de fabricación de una caja de luz para fachada, desde estructura y gráfica hasta resultado final.",
      simpleBrief: "Este contenido debe reforzar que Ixmati fabrica soluciones completas para negocios, no solo imprime piezas sueltas.",
      cta: "Cotiza una caja de luz para tu negocio.",
      refs: ["Caja de luz", "Estructura", "Gráfica", "Fachada", "Iluminación"],
      instructions: [
        "Muestra el armado o preparación de la caja de luz.",
        "Incluye toma de gráfica, estructura o prueba de luz.",
        "Cierra con resultado aplicado o preview del anuncio.",
        "Habla de visibilidad y presencia comercial."
      ],
      examples: [
        "Texto en pantalla: Así toma forma un anuncio luminoso.",
        "Texto en pantalla: Caja de luz para fachadas.",
        "Texto en pantalla: Tu marca visible día y noche."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview del proceso.",
      avoid: ["No muestres cableado inseguro.", "No expliques detalles técnicos complejos.", "No uses tomas donde no se distinga la pieza."],
      slides: [
        { title: "Escena 1", text: "Preparación de estructura", visual: "Caja de luz en proceso." },
        { title: "Escena 2", text: "Gráfica y armado", visual: "Material visual aplicado." },
        { title: "Escena 3", text: "Prueba de luz", visual: "Anuncio encendido o detalle de iluminación." },
        { title: "Escena 4", text: "Cotiza tu caja de luz", visual: "Cierre con CTA." }
      ]
    },
    {
      id: "OP-023",
      page: "op-detalle.html?id=OP-023",
      type: "IMAGEN promocional",
      calendarType: "Promoción",
      dueDate: "26 julio 2026",
      title: "Lonas publicitarias para promociones",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 imagen promocional",
      objective: "Promover lonas publicitarias para negocios que necesitan anunciar ofertas, aperturas, eventos o información visible.",
      simpleBrief: "Haz una imagen directa de venta. Debe verse útil para negocios locales que necesitan comunicar algo rápido y en grande.",
      cta: "Cotiza tu lona publicitaria con diseño e impresión.",
      refs: ["Lona exterior", "Promoción en fachada", "Negocio local", "Medidas", "Oferta"],
      instructions: [
        "Usa un título grande sobre promociones visibles.",
        "Muestra una lona en contexto real: fachada, evento o punto de venta.",
        "Incluye usos concretos: apertura, oferta, evento, menú o aviso.",
        "Cierra con cotización por medida."
      ],
      examples: [
        "Título posible: Haz visible tu promoción.",
        "Texto de apoyo: Lonas para ofertas, aperturas y eventos.",
        "CTA: Cotiza por medida."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses diseño tipo descuento exagerado.", "No pongas demasiadas medidas pequeñas.", "No uses fotos borrosas de lonas."],
      slides: [
        { title: "Post único", text: "Lonas publicitarias para promociones, aperturas y eventos.\nHaz que tu mensaje se vea claro y a buen tamaño.", visual: "Lona visible en fachada de negocio con CTA de cotización." }
      ]
    },
    {
      id: "OP-024",
      page: "op-detalle.html?id=OP-024",
      type: "REEL entrega",
      calendarType: "Trabajo realizado",
      dueDate: "27 julio 2026",
      title: "Reconocimientos personalizados para eventos",
      status: "Pendiente",
      priority: "Media",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar reconocimientos personalizados como opción para clausuras, premiaciones, empresas y eventos especiales.",
      simpleBrief: "El reel debe sentirse de entrega final: detalle, brillo, empaque y resultado. No lo hagas como catálogo plano.",
      cta: "Cotiza reconocimientos personalizados para tu evento.",
      refs: ["Reconocimientos", "Acrílico o MDF", "Grabado", "Entrega", "Evento"],
      instructions: [
        "Abre con close-up del reconocimiento terminado.",
        "Muestra detalles de nombre, logo o grabado.",
        "Incluye una toma de varios reconocimientos listos para entregar.",
        "Cierra con usos: escuelas, empresas, clausuras y premiaciones."
      ],
      examples: [
        "Texto en pantalla: Detalles que reconocen un logro.",
        "Texto en pantalla: Personalizados para tu evento.",
        "Texto en pantalla: Cotiza por cantidad y diseño."
      ],
      deliverableGuide: "Sube reel MP4 vertical o storyboard con capturas.",
      avoid: ["No muestres nombres sensibles sin permiso.", "No uses música solemne si el video se siente lento.", "No pongas demasiada información en pantalla."],
      slides: [
        { title: "Escena 1", text: "Reconocimiento personalizado", visual: "Close-up de pieza terminada." },
        { title: "Escena 2", text: "Detalles con nombre y logo", visual: "Detalle de grabado o impresión." },
        { title: "Escena 3", text: "Listos para entregar", visual: "Varias piezas ordenadas o empacadas." },
        { title: "Escena 4", text: "Cotiza para tu evento", visual: "Cierre con ejemplos de uso." }
      ]
    },
    {
      id: "OP-025",
      page: "op-detalle.html?id=OP-025",
      type: "POST producto",
      calendarType: "Temporada",
      dueDate: "28 julio 2026",
      title: "Termos y tazas personalizadas para empresas",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promover termos y tazas personalizadas para empresas que preparan regalos para clientes, equipos o eventos.",
      simpleBrief: "Enfoca el post en regalos útiles y memorables para empresas. Debe sentirse planeado, no improvisado.",
      cta: "Cotiza termos y tazas personalizadas para tu empresa.",
      refs: ["Termos personalizados", "Tazas", "Logo empresa", "Regalo corporativo", "Empaque"],
      instructions: [
        "Muestra termos y tazas como conjunto de regalo corporativo.",
        "Habla de clientes, equipo y eventos.",
        "Incluye idea de personalizar con logo o frase.",
        "Cierra con CTA para cotizar cantidades."
      ],
      examples: [
        "Título posible: Regalos que mantienen tu marca presente.",
        "Texto de apoyo: Termos y tazas personalizados para empresas.",
        "CTA: Cotiza por cantidad."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses mockups de baja calidad.", "No prometas stock inmediato sin revisar inventario.", "No hagas una composición saturada."],
      slides: [
        { title: "Post único", text: "Termos y tazas personalizadas para empresas.\nRegalos útiles para clientes, equipos y eventos.", visual: "Set de termo y taza con logo aplicado." }
      ]
    },
    {
      id: "OP-026",
      page: "op-detalle.html?id=OP-026",
      type: "CARRUSEL educativo",
      calendarType: "Servicio",
      dueDate: "29 julio 2026",
      title: "Vinil decorativo y microperforado para negocios",
      status: "Pendiente",
      priority: "Media",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "5 slides",
      objective: "Explicar usos diferentes del vinil decorativo y la lona microperforada para negocios con ventanas, vitrinas o fachadas.",
      simpleBrief: "Domingo educativo y ligero. Compara usos sin hacerlo técnico: decoración, privacidad, promoción y visibilidad.",
      cta: "Te ayudamos a elegir el material correcto para tu negocio.",
      refs: ["Vitrina", "Ventana con vinil", "Microperforado", "Negocio desde calle", "Privacidad"],
      instructions: [
        "Explica primero el problema: ventanas vacías o fachadas desaprovechadas.",
        "Diferencia vinil decorativo y microperforado con ejemplos simples.",
        "Muestra usos para promociones, privacidad e identidad visual.",
        "Cierra ofreciendo orientación para elegir material."
      ],
      examples: [
        "Slide 1: Tus ventanas también pueden comunicar.",
        "Slide 2: Vinil decorativo para identidad y ambiente.",
        "Slide 3: Microperforado para vista exterior y privacidad interior."
      ],
      deliverableGuide: "Sube carrusel en PNG/JPG por slide o preview completo.",
      avoid: ["No uses lenguaje técnico de instalación.", "No confundas vinil decorativo con lona normal.", "No satures con fotos de muchos estilos."],
      slides: [
        { title: "Tus ventanas también comunican", text: "Aprovecha vitrinas y cristales para mostrar marca, promociones o información.", visual: "Vitrina de negocio con aplicación visual." },
        { title: "Vinil decorativo", text: "Sirve para ambientar, reforzar identidad visual y vestir espacios.", visual: "Cristal o pared con patrón decorativo." },
        { title: "Microperforado", text: "Ideal para ventanas donde quieres comunicar hacia afuera y conservar privacidad.", visual: "Ventana con gráfico microperforado." },
        { title: "Usos comunes", text: "Promociones, horarios, logos, privacidad, decoración o lanzamientos.", visual: "Iconos o mini ejemplos aplicados." },
        { title: "Elegimos el material contigo", text: "Te orientamos según lugar, medida, objetivo y tipo de superficie.", visual: "Cierre con CTA de asesoría." }
      ]
    },
    {
      id: "OP-027",
      page: "op-detalle.html?id=OP-027",
      type: "POST producto",
      calendarType: "Producto",
      dueDate: "30 julio 2026",
      title: "Corte láser MDF para decoración y exhibición",
      status: "Pendiente",
      priority: "Media",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 post feed",
      objective: "Promover corte láser en MDF para piezas decorativas, exhibidores, nombres, bases, displays y proyectos personalizados.",
      simpleBrief: "Hazlo práctico: muestra posibilidades sin parecer manualidad genérica. Debe verse como solución para negocios, eventos y decoración comercial.",
      cta: "Cotiza corte láser MDF para tu proyecto.",
      refs: ["MDF cortado", "Decoración", "Display", "Nombre personalizado", "Exhibidor"],
      instructions: [
        "Muestra piezas MDF con corte limpio.",
        "Incluye usos: decoración, exhibición, eventos, nombres o displays.",
        "Habla de personalización por forma y medida.",
        "Cierra con CTA para cotizar proyecto."
      ],
      examples: [
        "Título posible: Piezas MDF a la medida de tu idea.",
        "Texto de apoyo: Corte láser para decoración, displays y eventos.",
        "CTA: Cotiza tu diseño."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses piezas quemadas o mal terminadas.", "No lo hagas ver infantil si va para negocios.", "No prometas pintura/acabado si no está incluido."],
      slides: [
        { title: "Post único", text: "Corte láser MDF para decoración, exhibición y proyectos personalizados.\nCreamos piezas a la medida de tu idea.", visual: "Piezas MDF cortadas con detalle y CTA." }
      ]
    },
    {
      id: "OP-028",
      page: "op-detalle.html?id=OP-028",
      type: "REEL proceso",
      calendarType: "Proceso",
      dueDate: "31 julio 2026",
      title: "Stickers corte a registro paso a paso",
      status: "Pendiente",
      priority: "Media",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar el proceso de stickers corte a registro para que se entienda la precisión entre impresión, contorno y acabado final.",
      simpleBrief: "Haz un reel de proceso visual: impresión, lectura/corte, desprendido y resultado final. Debe verse limpio y satisfactorio.",
      cta: "Cotiza stickers con corte personalizado.",
      refs: ["Impresión de stickers", "Plotter de corte", "Registro", "Desprendido", "Planilla final"],
      instructions: [
        "Muestra la hoja impresa antes del corte.",
        "Graba el momento del corte o desprendido.",
        "Enseña el contorno final y varias piezas listas.",
        "Cierra con usos para empaques, marcas y promociones."
      ],
      examples: [
        "Texto en pantalla: Así salen los stickers con corte personalizado.",
        "Texto en pantalla: Impresión, corte y acabado.",
        "Texto en pantalla: Ideales para marcas y empaques."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview del proceso.",
      avoid: ["No uses tomas movidas del plotter.", "No expliques parámetros técnicos.", "No muestres archivos con datos de cliente sin permiso."],
      slides: [
        { title: "Escena 1", text: "Impresión lista", visual: "Planilla de stickers impresa." },
        { title: "Escena 2", text: "Corte a registro", visual: "Plotter cortando el contorno." },
        { title: "Escena 3", text: "Desprendido limpio", visual: "Mano separando stickers o sobrante." },
        { title: "Escena 4", text: "Stickers listos para tu marca", visual: "Resultado final con varias piezas." }
      ]
    },
    {
      id: "OP-029",
      page: "op-detalle.html?id=OP-029",
      type: "REEL instalación",
      calendarType: "Trabajo realizado",
      dueDate: "3 agosto 2026",
      title: "Colocación de señalética interior",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram / TikTok",
      format: "1080x1920",
      pieces: "1 reel vertical",
      objective: "Mostrar la colocación de señalética interior en negocio u oficina para reforzar orden, orientación y presencia de marca.",
      simpleBrief: "Este reel debe vender instalación y acabado final. Muestra cómo una pared o área vacía se vuelve útil y profesional.",
      cta: "Cotiza señalética interior para tu espacio.",
      refs: ["Señalética interior", "Instalación", "Pared", "Oficina", "Marca"],
      instructions: [
        "Muestra el área antes de colocar la señal.",
        "Incluye proceso de alineación o colocación.",
        "Enseña el resultado final con contexto del espacio.",
        "Cierra con CTA para negocios y oficinas."
      ],
      examples: [
        "Texto en pantalla: Ordena y viste tu espacio.",
        "Texto en pantalla: Señalética interior personalizada.",
        "Texto en pantalla: Instalación profesional para negocios."
      ],
      deliverableGuide: "Sube reel MP4 vertical o preview de instalación.",
      avoid: ["No grabes espacios desordenados si distraen.", "No uses tomas oscuras.", "No muestres datos privados de oficinas."],
      slides: [
        { title: "Escena 1", text: "Antes de colocar", visual: "Pared o área interior sin señal." },
        { title: "Escena 2", text: "Instalación", visual: "Proceso de alineación o colocación." },
        { title: "Escena 3", text: "Resultado final", visual: "Señalética instalada en contexto." },
        { title: "Escena 4", text: "Cotiza tu espacio", visual: "CTA de señalética interior." }
      ]
    },
    {
      id: "OP-030",
      page: "op-detalle.html?id=OP-030",
      type: "IMAGEN promocional",
      calendarType: "Promoción",
      dueDate: "5 agosto 2026",
      title: "Playeras y gorras personalizadas para equipos",
      status: "Pendiente",
      priority: "Alta",
      platform: "Facebook / Instagram",
      format: "1080x1350",
      pieces: "1 imagen promocional",
      objective: "Promover playeras y gorras personalizadas para equipos, eventos, negocios y activaciones de marca.",
      simpleBrief: "Cierre de mes con promoción clara. Debe verse como solución para grupos, equipos y negocios, no solo como moda.",
      cta: "Cotiza prendas personalizadas para tu equipo.",
      refs: ["Playeras personalizadas", "Gorras con logo", "Equipo", "Vinil textil", "Marca aplicada"],
      instructions: [
        "Muestra playera y gorra como combo visual.",
        "Incluye usos: equipos, eventos, negocio, activaciones.",
        "Usa CTA claro para cotizar cantidades.",
        "Mantén estilo limpio y comercial."
      ],
      examples: [
        "Título posible: Personaliza prendas para tu equipo.",
        "Texto de apoyo: Playeras y gorras con tu logo.",
        "CTA: Cotiza por cantidad."
      ],
      deliverableGuide: "Sube imagen final en PNG o JPG.",
      avoid: ["No uses diseño tipo tienda de ropa sin marca.", "No pongas demasiados colores juntos.", "No prometas técnicas específicas sin validar prenda."],
      slides: [
        { title: "Post único", text: "Playeras y gorras personalizadas para equipos, eventos y negocios.\nCotiza prendas con tu logo.", visual: "Combo de playera y gorra con logo, fondo limpio y CTA." }
      ]
    }

  ];

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function postJson(payload) {
    if (!window.fetch) return Promise.resolve(null);
    return fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      if (!response.ok) throw new Error("Backend no disponible");
      return response.json();
    }).catch(function () {
      return null;
    });
  }

  function waitForSupabaseSession() {
    if (!supabaseClient) return Promise.resolve(false);
    if (supabaseSessionReady) return supabaseSessionReady;
    supabaseSessionReady = supabaseClient.auth.getSession().then(function (result) {
      supabaseAuthMissing = !Boolean(result && result.data && result.data.session);
      return !supabaseAuthMissing;
    }).catch(function () {
      supabaseAuthMissing = true;
      return false;
    });
    return supabaseSessionReady;
  }

  function loadSupabaseStore() {
    if (!supabaseClient) return Promise.resolve(null);
    return waitForSupabaseSession().then(function (hasSession) {
      if (!hasSession) {
        remoteError = "No hay sesion activa en Supabase. Cierra sesion y vuelve a entrar.";
        return null;
      }
      return Promise.all([
        supabaseClient.from("production_op_state").select("op_id,state"),
        supabaseClient.from("production_custom_ops").select("op_id,payload").order("created_at", { ascending: true })
      ]);
    }).then(function (results) {
      if (!results) return null;
      if (results[0].error || results[1].error) {
        remoteError = "No se pudo leer Supabase. Revisa la sesion y las politicas RLS.";
        return null;
      }
      var state = {};
      (results[0].data || []).forEach(function (row) {
        state[row.op_id] = row.state || {};
      });
      var customOps = (results[1].data || []).map(function (row) {
        return row.payload;
      }).filter(Boolean);
      return { state: state, customOps: customOps };
    }).catch(function () {
      remoteError = "No se pudo conectar con Supabase.";
      return null;
    });
  }

  function writeSupabaseState(state) {
    if (!supabaseClient) return Promise.resolve(false);
    var rows = Object.keys(state || {}).map(function (opId) {
      return { op_id: opId, state: state[opId] || {}, updated_at: new Date().toISOString() };
    });
    if (!rows.length) return Promise.resolve(true);
    return waitForSupabaseSession().then(function (hasSession) {
      if (!hasSession) return { error: true };
      return supabaseClient.from("production_op_state").upsert(rows, { onConflict: "op_id" });
    }).then(function (result) {
      return !result.error;
    }).catch(function () {
      return false;
    });
  }

  function writeSupabaseCustomOps(ops) {
    if (!supabaseClient) return Promise.resolve(false);
    var rows = (ops || []).map(function (op) {
      return { op_id: op.id, payload: op, updated_at: new Date().toISOString() };
    });
    if (!rows.length) return Promise.resolve(true);
    return waitForSupabaseSession().then(function (hasSession) {
      if (!hasSession) return { error: true };
      return supabaseClient.from("production_custom_ops").upsert(rows, { onConflict: "op_id" });
    }).then(function (result) {
      return !result.error;
    }).catch(function () {
      return false;
    });
  }

  function cacheRemote(data) {
    if (!data || typeof data !== "object") return;
    if (data.state) writeJson(STORAGE_KEY, data.state);
    if (data.customOps) writeJson(CUSTOM_OPS_KEY, data.customOps);
    remoteLoaded = true;
  }

  function ready(callback) {
    if (remoteLoaded) {
      callback();
      return;
    }
    if (supabaseClient) {
      loadSupabaseStore().then(function (data) {
        if (data) {
          cacheRemote(data);
          callback();
          return;
        }
        remoteLoaded = true;
        callback();
      });
      return;
    }
    if (!window.fetch) {
      callback();
      return;
    }
    fetch(API_URL, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Backend no disponible");
        return response.json();
      })
      .then(function (data) {
        cacheRemote(data);
        callback();
      })
      .catch(function () {
        callback();
      });
  }

  function readState() {
    return readJson(STORAGE_KEY, {});
  }

  function writeState(state) {
    writeJson(STORAGE_KEY, state);
    var remote = supabaseClient ? writeSupabaseState(state) : Promise.resolve(false);
    if (!supabaseClient) postJson({ action: "writeState", state: state }).then(cacheRemote);
    return remote;
  }

  function readCustomOps() {
    return readJson(CUSTOM_OPS_KEY, []);
  }

  function writeCustomOps(ops) {
    writeJson(CUSTOM_OPS_KEY, ops);
    writeSupabaseCustomOps(ops);
    postJson({ action: "writeCustomOps", customOps: ops }).then(cacheRemote);
  }

  function allOps() {
    var defaultIds = {};
    defaultOps.forEach(function (op) { defaultIds[op.id] = true; });
    return defaultOps.concat(readCustomOps().filter(function (op) { return op && !defaultIds[op.id]; }));
  }

  function getOp(id) {
    return allOps().filter(function (op) { return op.id === id; })[0] || allOps()[0];
  }

  function nextOpId() {
    var max = allOps().reduce(function (current, op) {
      var match = String(op.id || "").match(/^OP-(\d+)$/);
      return match ? Math.max(current, Number(match[1])) : current;
    }, 0);
    return "OP-" + String(max + 1).padStart(3, "0");
  }

  function opState(id) {
    return readState()[id] || {};
  }

  function saveOpState(id, patch) {
    var state = readState();
    state[id] = Object.assign({}, state[id] || {}, patch);
    return writeState(state);
  }

  function currentStatus(op) {
    return opState(op.id).status || op.status;
  }

  function statusClass(status) {
    if (status === "En diseno") return "design";
    if (status === "En revision" || status === "Enviado a aprobacion") return "review";
    if (status === "Aprobado" || status === "Publicado") return "done";
    if (status === "Cambios solicitados") return "high";
    if (status === "Programado") return "scheduled";
    return "pending";
  }

  function readFiles(files) {
    return Promise.all(files.map(function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve({ name: file.name, type: file.type, data: reader.result, uploadedAt: new Date().toISOString() });
        };
        reader.onerror = function () {
          resolve({ name: file.name, type: file.type, data: "", uploadedAt: new Date().toISOString() });
        };
        reader.readAsDataURL(file);
      });
    }));
  }

  function safeFileName(value) {
    return String(value || "archivo").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "archivo";
  }

  function uploadFilesToSupabase(opId, files) {
    if (!supabaseClient) return Promise.resolve(null);
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    return waitForSupabaseSession().then(function (hasSession) {
      if (!hasSession) throw new Error("No hay sesion activa en Supabase. Cierra sesion y vuelve a entrar.");
      return Promise.all(files.map(function (file, index) {
      var path = opId + "/" + stamp + "-" + index + "-" + safeFileName(file.name);
      return supabaseClient.storage.from(DELIVERY_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream"
      }).then(function (result) {
        if (result.error) throw result.error;
        var publicData = supabaseClient.storage.from(DELIVERY_BUCKET).getPublicUrl(path);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          path: path,
          data: publicData && publicData.data ? publicData.data.publicUrl : "",
          uploadedAt: new Date().toISOString()
        };
      });
      }));
    });
  }

  function uploadDelivery(opId, notes, files) {
    if (supabaseClient) {
      return waitForSupabaseSession().then(function (hasSession) {
        if (!hasSession) throw new Error("No hay sesion activa en Supabase. Cierra sesion y vuelve a entrar.");
        return uploadFilesToSupabase(opId, files).then(function (attachments) {
        var state = opState(opId);
        var deliveries = state.deliveries || [];
        deliveries.push({ notes: notes, files: attachments, status: "Pendiente de revision", createdAt: new Date().toISOString(), approvalNote: "" });
        return saveOpState(opId, { deliveries: deliveries, status: "Enviado a aprobacion" }).then(function (ok) {
          if (!ok) throw new Error("No se pudo guardar el estado en Supabase.");
          return readState();
        });
        });
      }).catch(function (error) {
        return { error: error && error.message ? error.message : "No se pudo subir el archivo a Supabase." };
      });
    }
    return uploadDeliveryToBackend(opId, notes, files);
  }

  function uploadDeliveryToBackend(opId, notes, files) {
    if (!window.fetch || !window.FormData) {
      return readFiles(files).then(function (attachments) {
        var state = opState(opId);
        var deliveries = state.deliveries || [];
        deliveries.push({ notes: notes, files: attachments, status: "Pendiente de revision", createdAt: new Date().toISOString(), approvalNote: "" });
        saveOpState(opId, { deliveries: deliveries, status: "Enviado a aprobacion" });
        return readState();
      });
    }
    var formData = new FormData();
    formData.append("action", "uploadDelivery");
    formData.append("opId", opId);
    formData.append("notes", notes);
    files.forEach(function (file) {
      formData.append("files[]", file);
    });
    return fetch(API_URL, { method: "POST", body: formData })
      .then(function (response) {
        if (!response.ok) throw new Error("Backend no disponible");
        return response.json();
      })
      .then(function (data) {
        cacheRemote(data);
        return readState();
      })
      .catch(function () {
        return readFiles(files).then(function (attachments) {
          var state = opState(opId);
          var deliveries = state.deliveries || [];
          deliveries.push({ notes: notes, files: attachments, status: "Pendiente de revision", createdAt: new Date().toISOString(), approvalNote: "" });
          saveOpState(opId, { deliveries: deliveries, status: "Enviado a aprobacion" });
          return readState();
        });
      });
  }

  window.IxmatiProduction = {
    supabaseEnabled: supabaseEnabled,
    supabaseClient: supabaseClient,
    checklist: checklist,
    statuses: statuses,
    defaultOps: defaultOps,
    ready: ready,
    allOps: allOps,
    getOp: getOp,
    nextOpId: nextOpId,
    opState: opState,
    saveOpState: saveOpState,
    readState: readState,
    writeState: writeState,
    readCustomOps: readCustomOps,
    writeCustomOps: writeCustomOps,
    currentStatus: currentStatus,
    statusClass: statusClass,
    readFiles: readFiles,
    remoteError: function () { return remoteError; },
    uploadDelivery: uploadDelivery
  };
})();
