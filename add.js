const fs = require('fs')
const root = __dirname+'\\src\\pages\\'

// Первый символ в верхний регистр
function ucfirst(word){
  return word.replace(/(^.)/g, (x) => x.toUpperCase())
}

let page = (process.argv[2] ? process.argv[2] : 'page'),
files = [
  `ctrl_${page}.ts`,
  `ifc_${page}.ts`,
  `init_${page}.ts`,
  `page_${page}.ts`,
  `page_${page}.vue`,
  `route_${page}.ts`,
  `vuex_${page}.ts`
],

// Записать данные в файл
data = [
// ctrl_page
  ``,
// ifc_page
  ``,
// init_page
  ``,
// page_page_ts
  ``,
// page_page_vue
  ``,
// route_page
  ``,

// vuex_page
`import { ${ucfirst(page)}I as I, ${ucfirst(page)}T as T, } from '@/pages/${page}/view/ifc_${page}';

/** Хранилище */
export namespace ${ucfirst(page)}StoreI{

  /** Индексированные списки */
  export class Ix {}

  /** Команды */
  export class Cmd {}

  /** Модели */
  export class One {}

  /** Список */
  export class List {}

  /** Статус */
  export class Status {}

  /** Статус */
  export class Tree {}
  
  /** Статус */
  export class Error {}
}`
]


if(fs.readdirSync(root).indexOf(page) != -1){
  console.log('Страница существует!')
} else {

  // Создаем папку с файлами
  fs.mkdir(root+page, err => {
    console.log('Создана папка: \\'+page)

    if(!err){
      // Создаем папки
      fs.mkdir(root+page+'\\el', err => { if(!err) console.log('Создана папка: \\el') })
      fs.mkdir(root+page+'\\service', err => { if(!err) console.log('Создана папка: \\service') })
      fs.mkdir(root+page+'\\view', err => { if(!err) console.log('Создана папка: \\view') })

      // Создаем файлы во view
      files.map((file, i) => {
        fs.writeFile(root+page+'\\view\\'+file, data[i], err => {
          if(!err) console.log('Файл создан: '+file)
        })
      })
    }

  })
}



