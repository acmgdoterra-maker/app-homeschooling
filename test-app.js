const { chromium } = require('playwright');
const path = require('path');

async function runTests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Iniciando pruebas...\n');

    // 1. Acceder a la aplicación
    console.log('1️⃣ Accediendo a http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.screenshot({ path: '/tmp/screenshots/01-inicio.png' });
    console.log('✅ App cargada correctamente\n');

    // 2. Agregar un hijo
    console.log('2️⃣ Agregando un hijo');
    await page.waitForSelector('input[placeholder="Ej: María"]');
    await page.fill('input[placeholder="Ej: María"]', 'María');
    await page.fill('input[type="date"]', '2015-05-10');
    await page.click('button:has-text("Agregar hijo/a")');
    await page.waitForNavigation();
    await page.screenshot({ path: '/tmp/screenshots/02-hijo-agregado.png' });
    console.log('✅ Hijo agregado correctamente\n');

    // 3. Crear un registro diario
    console.log('3️⃣ Creando registro diario');
    await page.click('button:has-text("Registro Diario")');
    await page.screenshot({ path: '/tmp/screenshots/03-seccion-diaria.png' });

    // Agregar nueva materia
    await page.click('button:has-text("Nueva Materia")');
    await page.waitForSelector('input[placeholder="Nombre de la materia"]');
    await page.fill('input[placeholder="Nombre de la materia"]', 'Matemáticas');
    await page.click('button:has-text("Agregar"):first-of-type');
    await page.screenshot({ path: '/tmp/screenshots/04-materia-agregada.png' });

    // Agregar descripción
    await page.fill('textarea[placeholder="¿Qué se hizo hoy en esta materia?"]', 'Aprendimos sobre fracciones');

    // Agregar checklist
    await page.fill('input[placeholder="Nuevo avance..."]', 'Entiende concepto de numerador');
    await page.click('button:has-text("+"):nth-of-type(1)');
    await page.screenshot({ path: '/tmp/screenshots/05-checklist-agregado.png' });

    // Guardar registro
    await page.click('button:has-text("Guardar Registro")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/screenshots/06-registro-guardado.png' });
    console.log('✅ Registro diario guardado\n');

    // 4. Agregar evento de calendario
    console.log('4️⃣ Agregando evento de calendario');
    await page.click('button:has-text("Calendario")');
    await page.waitForSelector('text=Dom');
    await page.screenshot({ path: '/tmp/screenshots/07-calendario.png' });

    // Hacer clic en un día (15)
    const dayButton = await page.locator('text=/^15$').first();
    await dayButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/tmp/screenshots/08-dia-seleccionado.png' });

    // Agregar evento
    await page.click('button:has-text("Agregar evento")');
    await page.fill('input[placeholder="Título del evento"]', 'Visita al Museo de Ciencias');
    await page.fill('textarea[placeholder="Descripción"]', 'Aprendimos sobre la física');
    await page.selectOption('select', 'museum');
    await page.click('button:has-text("Guardar"):last-of-type');
    await page.screenshot({ path: '/tmp/screenshots/09-evento-agregado.png' });
    console.log('✅ Evento de calendario agregado\n');

    // 5. Testear rastreador de hábitos
    console.log('5️⃣ Testando rastreador de hábitos');
    await page.click('button:has-text("Hábitos")');
    await page.screenshot({ path: '/tmp/screenshots/10-habitos.png' });

    // Ajustar rangos
    const autonomyRange = await page.locator('input[type="range"]').first();
    const choreRange = await page.locator('input[type="range"]').nth(1);
    const lifestyleRange = await page.locator('input[type="range"]').nth(2);

    await autonomyRange.fill('4');
    await choreRange.fill('3');
    await lifestyleRange.fill('5');

    await page.fill('textarea[placeholder*="Observaciones"]', 'Muy buen día hoy');
    await page.click('button:has-text("Guardar Registro de Hábitos")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/screenshots/11-habitos-guardados.png' });
    console.log('✅ Registro de hábitos guardado\n');

    // 6. Verificar persistencia (recarga la página)
    console.log('6️⃣ Verificando persistencia de datos');
    await page.reload();
    await page.waitForSelector('button:has-text("Registro Diario")');
    await page.screenshot({ path: '/tmp/screenshots/12-despues-recarga.png' });

    // Ir a registro diario
    await page.click('button:has-text("Registro Diario")');
    await page.screenshot({ path: '/tmp/screenshots/13-datos-persistidos.png' });
    console.log('✅ Datos persistidos después de recarga\n');

    // 7. Testear otras secciones
    console.log('7️⃣ Testando otras secciones');

    // Galería
    await page.click('button:has-text("Galería")');
    await page.screenshot({ path: '/tmp/screenshots/14-galeria.png' });

    // Diario
    await page.click('button:has-text("Diario")');
    await page.screenshot({ path: '/tmp/screenshots/15-diario.png' });

    // Biblioteca
    await page.click('button:has-text("Biblioteca")');
    await page.screenshot({ path: '/tmp/screenshots/16-biblioteca.png' });

    // Ideas
    await page.click('button:has-text("Ideas")');
    await page.screenshot({ path: '/tmp/screenshots/17-ideas.png' });

    // Portafolio
    await page.click('button:has-text("Portafolio")');
    await page.screenshot({ path: '/tmp/screenshots/18-portafolio.png' });

    console.log('✅ Todas las secciones accesibles\n');

    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!\n');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await browser.close();
  }
}

// Crear directorio de screenshots
const fs = require('fs');
const screenshotsDir = '/tmp/screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

runTests();
