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

        <!-- [ ДАТА ] -->
        <!-- <tr><td colspan="4">{{ item.date }}</td></tr> -->

        <tr>
          <td>{{ i + 1 }}</td>

          <!-- [ РЕДАКТИРУЕМ DATE ] -->
          <td v-if="editdate == i"><input ref="date" :value="item.date"></td>
          <td v-else @click="editDate(i)">{{ item.date }}</td>

          <!-- [ РЕДАКТИРУЕМ NUMBER ] -->
          <td v-if="editnumber == i"><input ref="number" :value="item.number"></td>
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
        <td colspan="4" @click="addOpen()">Добавить ячейку</td>
      </tr>
      <tr v-else>
        <td>{{ array.length + 1 }}</td>
        <td><input ref="date" :placeholder="date()"></td>
        <td><input ref="number" placeholder="0"></td>
        <td @click="addClose()">✕</td>
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
      day: 0,
      editdate: undefined,
      editnumber: undefined,
      add: true
    }
  },

  created() {
    document.onclick = (e) => {
      if(e.target.tagName != 'TD' &&
         e.target.tagName != 'INPUT'){
        this.add = true
        this.editdate = undefined
        this.editnumber = undefined
      }
    }

    document.onkeydown = (e) => {
      if(e.key == 'Enter'){
        if(this.editdate){
          this.array[this.editdate].date = this.formatDate(this.$refs.date[0].value)
          this.editdate = undefined
        } 
        if(this.editnumber){
          this.array[this.editnumber].number = this.formatNumber(this.$refs.number[0].value)
          this.editnumber = undefined
        }
        if(!this.add){
          this.array.push({
            'date':  this.formatDate(this.$refs.date.value),
            'number': this.formatNumber(this.$refs.number.value),
          })
          this.$refs.date.value = ''
          this.$refs.number.value = ''
          this.add = true
        }
      }
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
    date(){
      return (new Date()).toLocaleString('ru', {
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
      return (value ? value : this.date())
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

    /* [ РЕДАКТИРОВАТЬ ЯЧЕЙКУ ] */
    editDate(i){
      this.$emit('edit-date', i)
      this.add = true
      this.editnumber = undefined
      this.editdate = i
    },

    editNumber(i){
      this.$emit('delete-item', i)
      this.add = true
      this.editdate = undefined
      this.editnumber = i
    },

    /* [ УДАЛИТЬ ЯЧЕЙКУ ] */
    deleteItem(i){
      this.$emit('delete-item: ', i)
      this.add = true
      this.editdate = undefined
      this.editnumber = undefined
      this.array.splice(i,1)
    },

    /* [ ДОБАВИТЬ ЯЧЕЙКУ ] */
    addOpen(){
      this.$emit('add-open')
      this.add = false
      this.editdate = undefined
      this.editnumber = undefined
    },

    addClose(){
      this.$emit('add-close')
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
</style>
