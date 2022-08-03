import {
    Paragraph,
    Document,
    Packer,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    TextRun,
    VerticalAlign,
    SectionType,
    convertMillimetersToTwip,
    PageOrientation,
} from 'docx'
import { saveAs } from 'file-saver'
import banner from '../Assets/banner.jpg'

const generateDoc = async (rowData) => {
    const objArr = []
    const obj = {}

    const awaitBanner = await fetch(banner)
    const bannerImage = awaitBanner.blob()
    const borders = {
        top: {
            style: BorderStyle.NONE,
            size: 1,
        },
        bottom: {
            style: BorderStyle.NONE,
            size: 1,
        },
        left: {
            style: BorderStyle.NONE,
            size: 1,
        },
        right: {
            style: BorderStyle.NONE,
            size: 1,
        },
    }

    const aylar = [
        { 1: 'Ocak' },
        { 2: 'Şubat' },
        { 3: 'Mart' },
        { 4: 'Nisan' },
        { 5: 'Mayıs' },
        { 6: 'Haziran' },
        { 7: 'Temmuz' },
        { 8: 'Ağustos' },
        { 9: 'Eylül' },
        { 10: 'Ekim' },
        { 11: 'Kasım' },
        { 12: 'Aralık' },
    ]

    for (let i = 0; i < rowData.length; i++) {
        obj.fullname = rowData[i].fullname
        obj.firstJobDay = rowData[i].firstJobDay
        obj.university = rowData[i].university
        obj.description = rowData[i].description
        obj.image = rowData[i].image
        obj.department = rowData[i].department
        obj.workTitle = rowData[i].workTitle
        const jobDayParse = parseInt(obj.firstJobDay.substring(5, 7), 10)
        const jobDaySet = aylar[jobDayParse - 1][jobDayParse]
        const jobDayBirlestir = `${obj.firstJobDay.substring(
            8,
            10
        )} ${jobDaySet} ${obj.firstJobDay.substring(0, 4)}`

        // eslint-disable-next-line no-await-in-loop
        const image = await fetch(process.env.REACT_APP_API_URL + obj.image)
        const imageBlob = image.blob()
        const section = {
            properties: {
                type: SectionType.NEXT_PAGE,
                page: {
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                        height: convertMillimetersToTwip(210),
                        width: convertMillimetersToTwip(200),
                    },
                },
            },
            children: [
                new Paragraph({
                    children: [
                        new ImageRun({
                            // eslint-disable-next-line no-await-in-loop
                            data: await bannerImage,
                            transformation: {
                                width: 795,
                                height: 200,
                            },

                            floating: {
                                horizontalPosition: {
                                    offset: 1000,
                                },
                                verticalPosition: {
                                    offset: 1000,
                                },
                            },
                        }),
                        new TextRun({
                            text: '',
                            break: 9,
                        }),
                    ],
                }),
                new Table({
                    borders,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders,

                                    width: {
                                        size: 35,
                                        type: WidthType.PERCENTAGE,
                                    },
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    // eslint-disable-next-line no-await-in-loop
                                                    data: await imageBlob,
                                                    transformation: {
                                                        width: 165,
                                                        height: 165,
                                                    },
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    borders,
                                    verticalAlign: VerticalAlign.CENTER,

                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${obj.fullname}, ${jobDayBirlestir}`,
                                                    bold: true,
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: ' tarihi itibariyle ',
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: 'Orion Innovation Türkiye ',
                                                    bold: true,
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: 'ailesine ',
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: obj.workTitle,
                                                    bold: true,
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: ' olarak katılmıştır.',
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                            ],
                                        }),

                                        new Paragraph({
                                            children: [],
                                        }),

                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: obj.description,
                                                    size: 22,
                                                    font: 'Calibri',
                                                }),
                                            ],
                                        }),

                                        new Paragraph({
                                            children: [],
                                        }),

                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: `${obj.department} `,
                                                    bold: true,
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                                new TextRun({
                                                    text: `ekibimizde işe başlayan ${obj.fullname}'a 'Orion Innovation Türkiye’ye hoş geldin' der, yeni görevinde başarılar dileriz.`,
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                            ],
                                        }),
                                        new Paragraph({
                                            children: [],
                                        }),

                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: 'İnsan Kaynakları Departmanı',
                                                    size: 24,
                                                    font: 'Calibri',
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }
        objArr.push(section)
    }

    const doc = new Document({
        sections: objArr,
    })

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, 'employees.docx')
        console.log('Document created successfully')
    })
}
export default generateDoc
