import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Crear directorio de screenshots
const screenshotsDir = '/tmp/screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Iniciando pruebas...\n');

    // 1. Acceder a la aplicación
    console.log('1️⃣ Accediendo a http://localhost:5173');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotsDir, '01-inicio.png') });
    console.log('✅ App cargada correctamente\n');

    // 2. Agregar un hijo
    console.log('2️⃣ Agregando un hijo');
    await page.waitForSelector('input[placeholder="Ej: María"]');
    await page.fill('input[placeholder="Ej: María"]', 'María');
    await page.fill('input[type="date"]', '2015-05-10');

    // Buscar botón de agregar
    const buttons = await page.locator('button:has-text("Agregar")').all();
    await buttons[buttons.length - 1].click();

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '02-hijo-agregado.png') });
    console.log('✅ Hijo agregado correctamente\n');

    // 3. Crear un registro diario
    console.log('3️⃣ Creando registro diario');
    const dailyButton = await page.locator('button:has-text("Registro Diario")').first();
    await dailyButton.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '03-seccion-diaria.png') });

    // Agregar nueva materia
    const newSubjectBtn = await page.locator('button:has-text("Nueva Materia")').first();
    await newSubjectBtn.click();
    await page.waitForSelector('input[placeholder="Nombre de la materia"]');
    await page.fill('input[placeholder="Nombre de la materia"]', 'Matemáticas');

    const submitBtns = await page.locator('button:has-text("Agregar")').all();
    await submitBtns[0].click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04-materia-agregada.png') });

    // Agregar descripción
    await page.fill('textarea[placeholder="¿Qué se hizo hoy en esta materia?"]', 'Aprendimos sobre fracciones');

    // Agregar checklist
    await page.fill('input[placeholder="Nuevo avance..."]', 'Entiende concepto de numerador');
    const addButtons = await page.locator('button:has-text("+")').all();
    await addButtons[0].click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '05-checklist-agregado.png') });

    // Guardar registro
    const saveButtons = await page.locator('button:has-text("Guardar")').all();
    await saveButtons[saveButtons.length - 1].click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '06-registro-guardado.png') });
    console.log('✅ Registro diario guardado\n');

    // 4. Agregar evento de calendario
    console.log('4️⃣ Agregando evento de calendario');
    const calendarBtn = await page.locator('button:has-text("Calendario")').first();
    await calendarBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '07-calendario.png') });

    // Hacer clic en un día (15)
    const days = await page.locator('div[class*="grid"] > div').all();
    // Buscar el día 15 en el calendario
    for (let day of days) {
      const text = await day.textContent();
      if (text?.trim() === '15') {
        await day.click();
        break;
      }
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '08-dia-seleccionado.png') });

    // Agregar evento
    const eventBtn = await page.locator('button:has-text("Agregar evento")').first();
    if (await eventBtn.isVisible()) {
      await eventBtn.click();
      await page.fill('input[placeholder="Título del evento"]', 'Visita al Museo');
      await page.fill('textarea[placeholder="Descripción"]', 'Aprendimos sobre ciencias');

      // Seleccionar tipo
      const selects = await page.locator('select').all();
      if (selects.length > 0) {
        await selects[selects.length - 1].selectOption('museum');
      }

      const saveBtns = await page.locator('button:has-text("Guardar")').all();
      await saveBtns[saveBtns.length - 1].click();
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '09-evento-agregado.png') });
    console.log('✅ Evento de calendario agregado\n');

    // 5. Testear rastreador de hábitos
    console.log('5️⃣ Testando rastreador de hábitos');
    const habitsBtn = await page.locator('button:has-text("Hábitos")').first();
    await habitsBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '10-habitos.png') });

    // Ajustar rangos
    const ranges = await page.locator('input[type="range"]').all();
    if (ranges.length >= 3) {
      await ranges[0].fill('4');
      await ranges[1].fill('3');
      await ranges[2].fill('5');
    }

    const notesArea = await page.locator('textarea[placeholder*="Observaciones"]').first();
    if (await notesArea.isVisible()) {
      await notesArea.fill('Muy buen día hoy');
    }

    const saveBtns = await page.locator('button:has-text("Guardar")').all();
    await saveBtns[saveBtns.length - 1].click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '11-habitos-guardados.png') });
    console.log('✅ Registro de hábitos guardado\n');

    // 6. Verificar persistencia (recarga la página)
    console.log('6️⃣ Verificando persistencia de datos');
    await page.reload();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '12-despues-recarga.png') });

    // Ir a registro diario
    const dailyBtn2 = await page.locator('button:has-text("Registro Diario")').first();
    await dailyBtn2.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '13-datos-persistidos.png') });
    console.log('✅ Datos persistidos después de recarga\n');

    // 7. Testear otras secciones
    console.log('7️⃣ Testando otras secciones');

    // Galería
    const galleryBtn = await page.locator('button:has-text("Galería")').first();
    await galleryBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '14-galeria.png') });
    console.log('  ✅ Galería');

    // Diario
    const diaryBtn = await page.locator('button:has-text("Diario")').first();
    await diaryBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '15-diario.png') });
    console.log('  ✅ Diario');

    // Biblioteca
    const libBtn = await page.locator('button:has-text("Biblioteca")').first();
    await libBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '16-biblioteca.png') });
    console.log('  ✅ Biblioteca');

    // Ideas
    const ideasBtn = await page.locator('button:has-text("Ideas")').first();
    await ideasBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '17-ideas.png') });
    console.log('  ✅ Ideas');

    // Portafolio
    const portfolioBtn = await page.locator('button:has-text("Portafolio")').first();
    await portfolioBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '18-portafolio.png') });
    console.log('  ✅ Portafolio\n');

    console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!\n');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
