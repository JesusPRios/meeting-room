import { Pictograma } from "./../types/Pictograma";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Sustancia } from "../types/Sustancia";

const useChemicalReport = () => {
  const [sq, setSQ] = useState<Sustancia[]>([]);
  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);

  useEffect(() => {
    const getInfoReport = async () => {
      try {
        const [response, pictogramasResponse] = await Promise.all([
          fetch("http://10.7.167.119:3002/get-all-info-for-report"),
          fetch("http://10.7.167.119:3002/get-pictograma-photos"),
        ]);

        const data = await response.json();
        const pictogramasData = await pictogramasResponse.json();

        const pictogramas = Array.isArray(pictogramasData.photos)
          ? pictogramasData.photos
          : [];

        setSQ(Array.isArray(data.tableData) ? data.tableData : []);
        setPictogramas(pictogramas);
      } catch (error) {
        console.log("Error en getInfoReport:", error);
      }
    };

    getInfoReport();
  }, []);

  function formatFecha(fechaISO: string | null | undefined): string {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    const dia: string = String(fecha.getUTCDate()).padStart(2, "0");
    const mes: string = String(fecha.getUTCMonth() + 1).padStart(2, "0");
    const año: number = fecha.getUTCFullYear();
    return `${dia}/${mes}/${año}`;
  }

  const data = sq;

  const generateInventoryReport = async () => {
    if (sq.length === 0) {
      alert("No hay datos para generar el reporte");
      return;
    }

    const titles = [
      "PROCESO",
      "GESTIÓN ORGANIZACIONAL Y DEL RIESGO",
      "NOMBRE DEL FORMATO",
      "MATRIZ PRIORIZACIÓN DE SUSTANCIAS QUÍMICAS",
      "MATRIZ PRIORIZACIÓN DE SUSTANCIAS QUÍMICAS",
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("INVENTARIO SUSTANCIAS");

    worksheet.mergeCells("B1:AU2");
    worksheet.getRow(1).height = 100;
    worksheet.getColumn("B").width = 50;
    worksheet.getColumn("AV").width = 25;
    worksheet.getCell("AV1").value = "VERSIÓN: ";
    worksheet.getCell("AV2").value = "CÓDIGO: GOR-F-036";

    const mergedStyle: Partial<ExcelJS.Style> = {
      font: {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: "000000" },
      },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    const avCellStyle: Partial<ExcelJS.Style> = {
      font: {
        name: "Calibri",
        size: 8,
        bold: false,
        color: { argb: "000000" },
      },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    worksheet.getCell("B1").style = mergedStyle;
    worksheet.getCell("B2").style = mergedStyle;
    worksheet.getCell("AV1").style = avCellStyle;
    worksheet.getCell("AV2").style = avCellStyle;
    worksheet.getRow(1).height = 50;
    worksheet.getRow(2).height = 50;

    for (let i = 0; i < titles.length; i++) {
      const rowIndex = i + 3;
      worksheet.mergeCells(`B${rowIndex}:AV${rowIndex}`);
      const cell = worksheet.getCell(`B${rowIndex}`);
      cell.value = titles[i];
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.font = {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: i % 2 === 0 ? "FFFFFF" : "000000" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: i % 2 === 0 ? "000000" : "FFFFFF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    const preHeaders = [
      "REGIONAL",
      "CENTRO DE FORMACIÓN",
      "SEDE",
      "FECHA DE ELABORACIÓN:",
      "FECHA DE ÚLTIMA ACTUALIZACIÓN:",
      "RESPONSABLE DE ACTUALIZACIÓN",
    ];

    const startRow = 9;
    let startCol = 2;

    preHeaders.forEach((title) => {
      const titleCell = worksheet.getCell(startRow, startCol); // Celda con texto (Verde)
      const emptyCell = worksheet.getCell(startRow, startCol + 1); // Celda vacía (Blanca)

      // Asignar valor al título
      titleCell.value = title;

      titleCell.font = {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: "000000" }, // Color negro
      };

      // **Estilo para la celda del título (Verde)**
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "00B050" }, // Verde
      };
      titleCell.alignment = { horizontal: "left", vertical: "middle" };

      // **Estilo para la celda vacía (Blanca)**
      emptyCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" }, // Blanco
      };

      // Aplicar bordes a ambas celdas
      [titleCell, emptyCell].forEach((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // **Ajustar el ancho y alto**
      worksheet.getColumn(startCol).width = 55; // Ancho de la celda del título
      worksheet.getColumn(startCol + 1).width = 45; // Ancho de la celda vacía
      worksheet.getRow(startRow).height = 35; // Ajustar altura

      // **Saltar una celda antes de iniciar el siguiente bloque**
      startCol += 3; // Se deja una columna vacía
    });

    const pictogramasSGA = Array.from({ length: 9 }, () => "PICTOGRAMA SGA");

    const headers = [
      "NOMBRE COMERCIAL",
      "NOMBRE QUÍMICO",
      "NÚMERO CAS",
      "PROCESO",
      "ÁREA",
      "RESPONSABLE",
      "FABRICANTE",
      "DATOS DEL FABRICANTE",
      "ESTADO FÍSICO",
      "PRESENTACIÓN",
      "CANTIDAD EXISTENTE",
      "SUSTANCIA CONTROLADA",
      "TRASVASE",
      "FICHA DE SEGURIDAD",
      "FECHA DE ACTUALIZACIÓN",
      "FICHA 16 SECCIONES",
      "FICHA EN ESPAÑOL",
      "FICHA CON PICTOGRAMAS",
      "NÚMERO UN",
      "CLASE DE RIESGO",
      "PH",
      ...pictogramasSGA.map((p) => p.toUpperCase()),
      "CONSEJOS DE PELIGRO FRASES H",
      "CONSEJOS DE PRUDENCIA FRASES P",
      "PALABRA DE ADVERTENCIA",
      "CATEGORÍA DE PELIGRO",
      "TOXICIDAD AGUDA",
      "FRECUENCIA DE USO",
      "PROCEDIMIENTO DE USO",
      "TIPO DE VENTILACIÓN",
      "SUPERFICIE DEL CUERPO EXPUESTA",
      "CARCINOGENICIDAD",
      "LÍMITES DE EXPOSICIÓN",
      "ELEMENTOS DE PROTECCIÓN PERSONAL",
      "PELIGROS AMBIENTALES",
      "INCENDIOS Y DERRAMES",
      "ALMACENAMIENTO",
      "PUNTUACIÓN",
      "PRIORIZACIÓN",
    ];

    const startColumn = headers.indexOf("PICTOGRAMA SGA") + 1;

    const pictogramaDescriptions: string[] = [];

    const pictogramasData = Array.isArray(pictogramas)
      ? pictogramas.map((p, index) => {
          if (p.foto) {
            try {
              const base64Image = Array.isArray(p.foto) ? p.foto[0] : p.foto;

              const imageId = workbook.addImage({
                base64: base64Image,
                extension: "jpeg",
              });

              worksheet.addImage(imageId, {
                tl: {
                  col: startColumn + index,
                  row: pictogramaDescriptions.length + 6.99,
                },
                ext: { width: 120, height: 120 },
              });

              return ``;
            } catch (error) {
              console.error("⚠️ Error al agregar imagen:", error);
              return "⚠️ Error al cargar pictograma";
            }
          } else {
            console.log("❌ No se encontró imagen para:", p.name);
            return `❌ ${p.name};`;
          }
        })
      : [];

    pictogramaDescriptions.push(...pictogramasData);

    const descriptions = [
      "Nombre que aparece en la etiqueta",
      "NOMBRE QUIMICO/PRINCIPIO ACTIVO (Ver Sección 1 de la ficha de datos de seguridad o composición en la etiqueta)",
      "N° CAS (Ver Sección 1 de la ficha de datos de seguridad",
      "Relacione el proceso o la actividad en la que se utiliza la sustancia quimica: por ejemplo, decapado, desinfección, etc",
      "Relacione el área en la que se usa la sustancia quimica: almacen, área de pintura, etc",
      "Cargo del responsable de manipular la sustancia quimica",
      "Quien fabrica la sustancia química",
      "Relacionar el fabricante de la sustancia química, direcicon y numero de contacto en caso de emergencia",
      "ESTADO FÍSICO (sólido, líquido, gas)",
      "Relacione el tipó de envase o contenedor (tanque, caneca, bulto, frasco, etc)",
      "Ingrese la cantidad que se maneja de la sustancia en periodo de tiempo. Ejemplo: 2 litros por mes; 8 kilos por año. Pueden tomar esta información de los inventarios.",
      "Si se encuentra dentro del listado de sustancias controladas",
      "La sustancia química se trasvasa o no",
      "Escriba `Si` si se tiene ficha de seguridad de la sustancia química. ",
      "Relacionar fecha de actualización del documento (DD/MM/AAAA)",
      "La ficha de datos de seguridad cuenta con 16 secciones",
      "La ficha de datos de seguridad se encuentra en idioma Español.",
      "La ficha de datos de seguridad cuenta con  pictogramas",
      "Numero de 4 cifras de identificación del quimico.Se encuentra en la seccion 14  (transporte) de la  ficha de datos de seguridad o puede que no le aplique. Por ejemplo  4123",
      `Ver sección 14 (información relativa al transporte) en la ficha de seguridad 
  Son 9 clases:
  Clase 1. Explosivos. 
  Clase 2 Gases. 
  Clases 3. Liquidos inflamables. 
  Clase 4. Solidos inflamables. 
  Clase 5. Oxidantes.
  Clase 6. Toxicos y sustancias infecciosas. 
  Clase 7. Sustancias radiactivas. 
  Clase 8. Corrosivos. 
  Clase 9. Miscelaneos. Puede que no sea peligroso para el transporte y no aparece ninguno de estos.`,
      `pH de la sustancia química se encuentra en la sección 9.
  Número
  Alcalino 8-14
  Neutro 7
  Acido 1- 6`,
      ...pictogramaDescriptions,
      `FRASES H clasificación SGA, usualmente en la seccion 2 de fichas de datos de seguridad. 
  
  Frases H: H314 Provoca quemaduras graves en la piel y lesiones oculares `,
      `Relacionar los consejos de prudencia de SGA, que usualmente tiene un codigo que empieza con P; se encuentran en la sección 2 de la ficha de datos de seguridad
  
  Ejemplo: P405 Guardar bajo llave`,
      "La palabora de advertencia aparece en las fichas con sistema globalmente armonizado, con palabras peligro, atencion o ninguna",
      "Se tiene en cuenta la categoria de toxicidad aguda más baja. Por ejemplo: Toxicidad aguda. Categoria 1, Inhalación",
      `CATEGORIA DEL PELIGRO
  
  Caterogira 4 / no peligroso: 1
  Categoría 3:  2
  Categoría 2  3
  Categoría 1 : 4`,
      `1: OCASIONAL
  2 INTERMITENTE
  3 FRECUENTE
  4 PERMANENTE`,
      "REVISAR EJEMPLOS DE EXPOSICIONSe clasifica según lo expuesto que este el trabajor acorde al proceso:  1. Cerrado permanentemente (poca exposición, sistema cerrado cabina de pintura) 2.  Cerrado regularmente (alguna exposición,  cabina mal cerrada) 3. Abierto (como pintura con brocha); 4. . Disperso (como pintura con pistola)",
      `1. Cabina de extraccción  
  2. Extracción localizada  
  3. Ventilación mecanica general
  4. Solo ventilación natural favorable
  5. Ventilación natural desfavorable
  6. Sin Ventilación
  
  REVISAR NORMATIVIDAD SOBRE EXTRACCION`,
      `Relacionar que parte del cuerpo esta expuesta manipular el quimico, de la columna ""Superficies expuestas""
  
  1. Exposición con elementos de Protección Personal
  2. Una Mano
  3. Dos manos /  Una mano + antebrazo
  4. Dos manos + antebrazo   / Brazo completo
  5. Superficie que comprende los miembros superiores y torso y/o  pelvis y/o las piernas`,
      `IARC: Se encuentra en la fichga de datos de seguridad en la sección 11.
  ö en la página de IARC
  https://monographs.iarc.who.int/list-of-classifications
  Buscar con el nombre de la sustancias quimica ó el numero CAS
  
  SIN DATOS:  1
  CLASE 2B: 2
  CLASE 2A:  3
  CLASE 1:  4`,
      "Los límites de exposición se encuentran en la ficha de datos de seguridad en la sección 8. STEEL: Exposición media pontderada en un tiempo de 15 minutos. TWA: concentración por promedio ponderado de tiempo hasta 10 horas de joranada de trabajo",
      "Relacione los elementos de protección que le aplica a la sustancia quimica. Tome la información de la ficha de datos de seguridad de la sección 8.",
      "Ver sección ecológica de la ficha de datos de seguridad. Escriba el que corresponda: Peligroso para fuentes hídricas, bioacumulable, bioconcentrable, no biodegradable",
      "Relacione si hay un requerimiento especial en caso de incendio o vertido accidental La informacion sobre incendio se encuentra en la seccion 5 de la ficha de datos de seguridad.  La derrames sobre incendio se encuentra en la seccion 6 de la ficha de datos de seguridad.",
      "Relacione si hay un requerimiento especial para el almacenamiento seguro La informacion sobre almacenamiento se encuentra en la seccion 10 de la ficha de datos de seguridad.",
      "Puntuación de riesgo",
      `ELEVADA
  MEDIA
  BAJA
  `,
    ];

    const headersWithEmpty = ["", ...headers];
    const descriptionsWithEmpty = ["", ...descriptions];

    const headerStartRow = startRow + 2;

    const headerRow = worksheet.getRow(headerStartRow);
    headerRow.values = headersWithEmpty;
    headerRow.height = 35;

    headerRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        cell.font = {
          name: "Calibri",
          size: 12,
          bold: true,
          color: { argb: "000000" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00B050" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    const columnWidth = 60;
    headersWithEmpty.forEach((_, colNumber) => {
      if (colNumber > 1) {
        worksheet.getColumn(colNumber).width = columnWidth;
      }
    });

    const descriptionsStartRow = headerStartRow + 1;

    const descriptionRow = worksheet.getRow(descriptionsStartRow);
    descriptionRow.values = descriptionsWithEmpty;
    descriptionRow.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        if (!cell.value) cell.value = "N/A";

        cell.font = {
          name: "Arial",
          size: 8,
          bold: true,
          color: { argb: "000000" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D0CECE" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    let rowIndex = descriptionsStartRow + 1;

    data.forEach((item) => {
      const row = worksheet.getRow(rowIndex);

      // console.log(
      //   ...pictogramas.map(({ inventario_id, asignado }) =>
      //     item.inventario_id === inventario_id ? (asignado ? "SÍ" : "N/A") : "m"
      //   ),
      // )

      row.values = [
        "",
        item.nombre_comercial || "",
        item.nombre_quimico || "",
        item.numero_CAS || "",
        item.proceso || "",
        item.area || "",
        item.responsable || "",
        item.fabricante || "",
        item.datos_fabricante || "",
        item.estado_sustancia || "",
        item.presentacion || "",
        item.cantidad_existente || "",
        item.sustancia_controlada || "",
        item.trasvase || "",
        item.ficha_seguridad || "",
        formatFecha(item.fecha_actualizacion) || "",
        item.ficha_16_secciones || "",
        item.ficha_en_espanol || "",
        item.ficha_con_pictogramas || "",
        item.numero_UN || "",
        item.clase_riesgo || "",
        item.ph || "",
        ...pictogramas.map(({ inventario_id, asignado }) =>
          item.inventario_id === inventario_id
            ? asignado
              ? "SÍ"
              : "N/A"
            : "N/A"
        ),
        item.frases_P || "",
        item.consejos_prudencia || "",
        item.palabra_advertencia || "",
        item.categoria_peligro || "",
        item.toxicidad_aguda || "",
        item.frecuencia_uso || "",
        item.procedimiento_uso || "",
        item.tipo_ventilacion || "",
        item.superficie_expuesta || "",
        item.carcinogenicidad || "",
        item.limites_exposicion || "",
        item.proteccion_personal || "",
        item.peligros_ambientales || "",
        item.incendios_derramas || "",
        item.almacenamiento || "",
        item.puntuacion || "",
        item.priorizacion.toUpperCase() || "",
      ];

      row.commit();
      row.height = 125;

      const priorizacionCell = row.getCell(row.values.length - 1);
      switch (item.priorizacion.toLowerCase()) {
        case "baja":
          priorizacionCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "00B050" },
          };
          break;
        case "media":
          priorizacionCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };
          break;
        case "elevada":
          priorizacionCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF0000" },
          };
          break;
      }

      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      rowIndex++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "INVENTARIO_SUSTANCIAS.xlsx");
  };

  const generateChemicalReport = async () => {
    if (sq.length === 0) {
      console.warn("No hay datos para generar el reporte");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Matriz Compatibilidad");

    const subHeaderStyle: Partial<ExcelJS.Style> = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "595959" } },
      font: { bold: false, color: { argb: "FFFFFF" }, size: 10 },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    worksheet.mergeCells("A3:AA3");
    worksheet.getCell("A3").value =
      "Proceso Gestión Organizacional y del Riesgo";
    worksheet.getCell("A3").style = subHeaderStyle;

    worksheet.mergeCells("A4:AA4");
    worksheet.getCell("A4").value = "Formato Matriz de Compatibilidad Química";
    worksheet.getCell("A4").style = subHeaderStyle;

    for (let col = 1; col <= 27; col++) {
      worksheet.getCell(3, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    for (let col = 1; col <= 27; col++) {
      worksheet.getCell(4, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    worksheet.getRow(3).height = 25;
    worksheet.getRow(4).height = 25;
    worksheet.getRow(6).height = 30;
    worksheet.getRow(7).height = 30;

    worksheet.mergeCells("A1:Z2");
    const cellA1 = worksheet.getCell("A1");
    cellA1.value = "";
    cellA1.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    if (worksheet.getCell("Z1").isMerged) worksheet.unMergeCells("Z1:AA1");
    if (worksheet.getCell("Z2").isMerged) worksheet.unMergeCells("Z2:AA2");

    worksheet.mergeCells("A1:Y2");
    worksheet.mergeCells("Z1:AA1");
    worksheet.mergeCells("Z2:AA2");

    const cellZ1 = worksheet.getCell("Z1");
    cellZ1.value = "VERSIÓN: 01";
    cellZ1.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cellZ1.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const cellZ2 = worksheet.getCell("Z2");
    cellZ2.value = "CÓDIGO: GOR-F-0675";
    cellZ2.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cellZ2.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.addRow([]);

    const headers = [
      {
        rangeColor: "A6:C6",
        restRange: "D6:G6",
        text: "REGIONAL",
        leftAlign: true,
      },
      {
        rangeColor: "A7:C7",
        restRange: "D7:G7",
        text: "FECHA DE ELABORACION",
        leftAlign: true,
      },
      {
        rangeColor: "H6:J6",
        restRange: "K6:O6",
        text: "CENTRO",
        leftAlign: false,
      },
      {
        rangeColor: "H7:J7",
        restRange: "K7:O7",
        text: "FECHA DE ÚLTIMA ACTUALIZACIÓN",
        leftAlign: false,
      },
      {
        rangeColor: "P6:R6",
        restRange: "S6:X6",
        text: "SEDE",
        leftAlign: false,
      },
      {
        rangeColor: "P7:R7",
        restRange: "S7:X7",
        text: "FECHA DE ÚLTIMA ACTUALIZACIÓN",
        leftAlign: false,
      },
      {
        rangeColor: "Y6:Z7",
        restRange: "AA6:AA7",
        text: "RESPONSABLES DE ACTUALIZACIÓN",
        leftAlign: false,
        vertical: true,
      },
    ];

    headers.forEach(({ rangeColor, restRange, text, leftAlign, vertical }) => {
      const [colorStart] = rangeColor.split(":");

      worksheet.mergeCells(rangeColor);
      const colorCell = worksheet.getCell(colorStart);
      colorCell.value = text;
      colorCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "009999" },
      };
      colorCell.alignment = {
        horizontal: leftAlign ? "left" : "center",
        vertical: vertical ? "middle" : "middle",
        wrapText: true,
      };
      colorCell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
        name: "Arial",
        size: 10,
      };
      colorCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (restRange) {
        const [restStart] = restRange.split(":");
        worksheet.mergeCells(restRange);
        const restCell = worksheet.getCell(restStart);
        restCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF" },
        };
        restCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    worksheet.columns = Array(26).fill({ width: 15 });
    worksheet.addRow([]);
    worksheet.getRow(9).height = 45;
    worksheet.getRow(10).height = 40;

    const columnWidths = {
      A: 25,
      B: 25,
      C: 20,
      D: 20,
      E: 25,
      F: 20,
      G: 20,
      H: 18,
      I: 18,
    };

    Object.entries(columnWidths).forEach(([col, width]) => {
      worksheet.getColumn(col).width = width;
    });

    const preTableHeaders = [
      { range: "A9:B9", text: "NOMBRE DE LA SUSTANCIA" },
      { range: "C9:D9", text: "IDENTIFICACIÓN DE LA SUSTANCIA" },
      { range: "E9:E9", text: "NOMBRE COMERCIAL" },
    ];

    preTableHeaders.forEach(({ range, text }) => {
      worksheet.mergeCells(range);
      const startCell = range.split(":")[0];
      const cell = worksheet.getCell(startCell);
      cell.value = text;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "009999" },
      };
      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
        name: "Arial",
        size: 10,
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    for (let col = 1; col <= 27; col++) {
      worksheet.getCell(9, col).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }

    const tableHeader = [
      "NOMBRE COMERCIAL",
      "NOMBRE ESPECÍFICO DE LA SUSTANCIA (Nomenclatura química)",
      "ESTADO FÍSICO DE LA SUSTANCIA",
      "CLASIFICACIÓN DE LA CLASE DE PELIGRO",
      "SGA PICTOGRAMA",
    ];

    const tableRow = worksheet.getRow(10);
    tableRow.values = tableHeader;
    tableRow.height = 40;

    const headerRow = worksheet.getRow(9);
    let columnIndex = 6;

    sq.forEach((item) => {
      const cell = headerRow.getCell(columnIndex);
      cell.value = item.nombre_comercial?.toUpperCase() || "";
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.font = { bold: false, name: "Calibri", size: 11 };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      columnIndex++;
    });

    let pictogramColumnIndex = 6;

    sq.forEach((item) => {
      if (item.pictogramas_base64 && Array.isArray(item.pictogramas_base64)) {
        worksheet.getColumn(pictogramColumnIndex).width = 20;

        const imageSize = 40;
        const rowStart = 9.2;
        const colStart = pictogramColumnIndex - 0.5;
        const separation = 0.6;

        let offsetX = 0;

        item.pictogramas_base64.forEach((pictogramaBase64) => {
          try {
            const imageId = workbook.addImage({
              base64: pictogramaBase64,
              extension: "jpeg",
            });

            worksheet.addImage(imageId, {
              tl: { col: colStart + offsetX, row: rowStart },
              ext: { width: imageSize, height: imageSize },
            });

            offsetX += separation;
          } catch (error) {
            console.error("Error al agregar imagen:", error);
          }
        });
      }
      pictogramColumnIndex++;
    });

    tableRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: "FFFFFF" },
          name: "Arial",
          size: 10,
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "009999" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    sq.forEach((item) => {
      const row = worksheet.addRow([
        item.nombre_comercial?.toUpperCase() || "",
        item.nombre_quimico?.toUpperCase() || "",
        item.estado_sustancia?.toUpperCase() || "",
        item.clase_riesgo?.toUpperCase().replace(/_/g, " ") || "",
        "", 
      ]);
    
      row.height = 80;
    
      if (item.pictogramas_base64 && Array.isArray(item.pictogramas_base64)) {
        worksheet.getColumn(5).width = 30;
    
        const imageSize = 70;
        const colStart = 4.5;
        const rowStart = row.number - 0.8;
        const separation = 0.3999;
    
        let offsetX = 0;
    
        item.pictogramas_base64.forEach((pictogramaBase64) => {
          try {
            const imageId = workbook.addImage({
              base64: pictogramaBase64,
              extension: "jpeg",
            });
    
            worksheet.addImage(imageId, {
              tl: { col: colStart + offsetX, row: rowStart },
              ext: { width: imageSize, height: imageSize },
            });
    
            offsetX += separation;
          } catch (error) {
            console.error("Error al agregar imagen:", error);
          }
        });
    
        if (item.pictogramas_base64.length > 1) {
          row.height = 80;
        }
      }
    
      const preHeaderPictograms = Array.isArray(tableRow.values) && tableRow.values[6]
        ? tableRow.values[6]
        : [];
      const rowPictograms = Array.isArray(item.pictogramas_base64)
        ? item.pictogramas_base64
        : [];
    
        const normalize = (arr: string[]): string[] => arr.map((pic: string) => pic.trim().toLowerCase());

        const allMatch: boolean =
          Array.isArray(preHeaderPictograms) &&
          Array.isArray(rowPictograms) &&
          preHeaderPictograms.length === rowPictograms.length &&
          normalize(preHeaderPictograms).every((pictogramaHeader: string) =>
            normalize(rowPictograms).includes(pictogramaHeader)
          );   
    
      const color = allMatch ? "00B050" : "00B050";
      row.getCell(6).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
      };
    
      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
    
    for (let rowIndex = 9; rowIndex <= worksheet.rowCount; rowIndex++) {
      for (let colIndex = 1; colIndex <= 27; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "matriz_compatibilidad.xlsx");
  };

  return { sq, generateInventoryReport, generateChemicalReport };
};

export default useChemicalReport;