<template>
  <table>
    <thead>  
      <!-- [ НАЗВАНИЕ ТАБЛИЦЫ ] -->
      <tr>
        <td colspan="4">{{ title }}</td>
      </tr>

      <!-- [ ЗАГОЛОВОК ] -->
      <tr>
        <th>№</th>
        <th>Дата</th>
        <th>Доходы/Расходы</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      <template v-for="(item, i) in array" :key="i">

        <tr v-if="isDay(item.date)">
          <td class="day" colspan="4">{{ getDate(this.day) }}</td>
        </tr>

        <tr>
          <td>{{ i + 1 }}</td>

          <!-- [ РЕДАКТИРУЕМ DATE ] -->
          <td v-if="editdate == i">
            <input 
              ref="date" 
              :value="item.date" 
              @blur="editClose" 
              @keypress.enter="saveEditData('date')"
            >
          </td>
          <td v-else @click="editDate(i)">{{ item.date }}</td>

          <!-- [ РЕДАКТИРУЕМ NUMBER ] -->
          <td v-if="editnumber == i">
            <input 
              ref="number" 
              :value="item.number" 
              @blur="editClose" 
              @keypress.enter="saveEditData('number')"
            >
          </td>
          <td v-else @click="editNumber(i)" :style="getTextColor(item.number)">{{ item.number }}</td>

          <td @click="deleteItem(i)">✕</td>
        </tr>

      </template>
    </tbody>

    <tfoot>
      <!-- [ РЕЗУЛЬТАТ ] -->
      <tr v-if="array.length > 0">
        <th></th><th>Итого:</th><th :style="getTextColor(result())">{{ result() }}</th><th></th>
      </tr>
      <tr v-else>
        <td colspan="4" style="color:red">Пусто!</td>
      </tr>

      <!-- [ ДОБАВИТЬ ЯЧЕЙКУ ] -->
      <tr v-if="add">
        <td colspan="4" @click="addOpen">Добавить ячейку</td>
      </tr>
      <tr v-else @keypress.enter="saveAddData">
        <td>{{ array.length + 1 }}</td>

        <!-- [ РЕДАКТИРУЕМ DATE ] -->
        <td v-if="addDateOpen">
          <input 
            ref="date" 
            :placeholder="today()" 
            @blur="addEditClose"
            v-model="adddate"
          >
        </td>
        <td v-else @click="addEditOpen('date')">{{ adddate }}</td>

        <!-- [ РЕДАКТИРУЕМ NUMBER ] -->
        <td v-if="addNumberOpen">
          <input 
            ref="number" 
            placeholder="0" 
            @blur="addEditClose"
            v-model="addnumber"
          >
        </td>
        <td v-else @click="addEditOpen('number')">{{ addnumber }}</td>

        <td @click="addClose">✕</td>
      </tr>
    </tfoot>
   
  </table>
</template>



<script>
import json from './Array.json'

export default {
  name: 'table-finance',

  data(){
    return {
      title: 'Таблица финансов',
      array: json,
      getday: true,
      day: '',
      editdate: undefined,
      editnumber: undefined,
      add: true,
      adddate: this.today(),
      addnumber: '0',
      addDateOpen: false,
      addNumberOpen: false
    }
  },

  updated(){
    /* [ СОРТИРОВКА ДАТЫ ПО ВОЗРАСТАНИЮ ] */
    this.array.sort((a,b) => {
      return this.dateToNumber(a['date']) - this.dateToNumber(b['date'])
    })
  },

  methods: {

    /* [ СУМИРОВАТЬ ВСЕ ЯЧЕЙКИ И ВЫВЕСТИ РЕЗУЛЬТАТ ] */ 
    result(){
      let n = 0;
      for(let i=0; i<this.array.length; i++){
        n += (!this.array[i]['number'].match(/[a-zа-я]+/i) ? parseFloat(this.array[i]['number']) : 0)
      } 
      return (n > 0 ? '+'+n.toFixed(2) : n.toFixed(2)).replace('.00', '')
    },

    /* [ ПОЛУЧИТЬ СЕГОДНЯШНЮЮ ДАТУ ] */ 
    today(){
      return (new Date()).toLocaleString('ru', {
        year:  'numeric', 
        month: 'numeric', 
        day:   'numeric'
      })
    },

    /* [ ПОЛУЧИТЬ ВЧЕРАШНЮЮ ДАТУ ] */ 
    yesterday(){
      let today = new Date()
      today.setDate(today.getDate()-1)
      return today.toLocaleString('ru', {
        year:  'numeric', 
        month: 'numeric', 
        day:   'numeric'
      })
    },

    /* [ ДАТА В ЧИСЛО ] */
    dateToNumber(str){
      return parseInt(str.slice(6,11)+str.slice(3,5)+str.slice(0,2))
    },

    /* [ ФОРМАТИРОВАНИЕ DATE ] */ 
    formatDate(value){
      return (value ? value : this.today())
    },

    /* [ ФОРМАТИРОВАНИЕ NUMBER ] */ 
    formatNumber(value){
      return (value > 0 && value.substring(0,1) !== '+' 
      ? '+'+value : (value === '' ? '0' : value))
    },

    /* [ ПОЛУЧИТЬ ЦВЕТ ТЕКСТА ] */ 
    getTextColor(value){
      value = String(value)
      return (value.substring(0,1) === '+' ? {color: 'green'} : 
      (value.substring(0,1) === '-' ? {color: 'red'} : {color: 'gray'})) 
    },

    /* [ ... ] */
    isDay(value){
      if(this.day !== value){
        this.day = value
        return true
      }
      return false
    },

    /* [ ... ] */
    getDate(){
      if(this.day == this.today()){
        return 'Сегодня'
      } else if(this.day == this.yesterday()){
        return 'Вчера'
      } else {
        return this.day
      }
    },

    /* [ ... ] */
    saveEditData(){
      if(this.editdate !== undefined){
        this.array[this.editdate].date = this.formatDate(this.$refs.date[0].value)
        this.editdate = undefined
      }
      if(this.editnumber !== undefined){
        this.array[this.editnumber].number = this.formatNumber(this.$refs.number[0].value)
        this.editnumber = undefined
      }
    },

    /* [ ... ] */
    saveAddData(){
      this.array.push({
        'date':  this.formatDate(this.adddate),
        'number': this.formatNumber(this.addnumber),
      })
      this.adddate = this.today()
      this.addnumber = '0'
      this.add = true
    },

    /* [ РЕДАКТИРОВАТЬ ЯЧЕЙКУ ] */
    editDate(i){
      this.add = true
      this.editnumber = undefined
      this.editdate = i
      this.$nextTick(() => {
        this.$refs['date'][0].focus()
      })
    },

    editNumber(i){
      this.add = true
      this.editdate = undefined
      this.editnumber = i
      this.$nextTick(() => {
        this.$refs['number'][0].focus()
      })
    },

    editClose(){
      this.add = true
      this.editdate = undefined
      this.editnumber = undefined
    },

    /* [ УДАЛИТЬ ЯЧЕЙКУ ] */
    deleteItem(i){
      this.add = true
      this.editdate = undefined
      this.editnumber = undefined
      this.array.splice(i,1)
    },

    /* [ ДОБАВИТЬ ЯЧЕЙКУ ] */
    addOpen(){
      this.add = false
      this.editdate = undefined
      this.editnumber = undefined
      // Сделать number активным
      this.addEditOpen('number')
    },

    /* [ ... ] */
    addEditOpen(value){
      if(value == 'date'){
        this.addNumberOpen = false
        this.addDateOpen = true
      } else {
        this.addDateOpen = false
        this.addNumberOpen = true
      }     
      this.$nextTick(() => {
        this.$refs[value].focus()
      })
    },

    /* [ ... ] */
    addEditClose(){
      this.addDateOpen = false
      this.addNumberOpen = false
    },

    /* [ ... ] */
    addClose(){
      this.adddate = this.today()
      this.addnumber = '0'
      this.add = true
    }
  }
}
</script>



<style scoped>
  /* [ ... ] */
  table, tr, th, td {
    margin: 100px auto;
    border: 1px solid rgb(66, 66, 66);
    cursor: default;
    text-align: center;
  }
  th, td {
    text-align: center;
    height: 31px;
  }

  /* [ ... ] */
  th:nth-child(2){ 
    width: 100px;
  }
  th:nth-child(3){ 
    width: 190px;
  }
  td:nth-child(3){
    font-style: italic;
  }
  th:nth-child(1),
  th:nth-child(4){
    width: 35px; 
  }
  td:nth-child(1){
    font-weight: bold;
  }
  td:nth-child(4){
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  /* [ ... ] */
  td:last-child {
    cursor: pointer;
    user-select: none;
  }

  /* [ ... ] */
  input {
    font-family: 'Time new roman';
    text-align: center;
    width: 100%;
    height: 100%;
    font-size: 16px;
    border: none;
    outline: none;
    box-shadow: inset 0px 0px 3px blue;
    color: blue;
  }

  /* [ ... ] */
  .day{
    height: 23px;
    font-size: 14px;
    border: none;
    background: rgb(238, 238, 238);
  }
</style>
