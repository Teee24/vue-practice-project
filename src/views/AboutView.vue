<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const catchkeyword = ref('catch') // 關鍵字樣式
const keyword = ref('') // 關鍵字
const beforeSearchData = ref([])
let totalPageLength = ref(0)

// 撈資料
async function fetchData() {
  const res = await fetch(
    `https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json`
  )
  const data = await res.json()
  beforeSearchData.value = data
}

// 關鍵字搜尋
const afterSearchData = computed(() => {
  return beforeSearchData.value.filter((item) => item['ar'].match(keyword.value))
})

// 標出關鍵字
// 用map會傳回新的array
// const highlight = ref()
const afterHighlightData = afterSearchData.value.map((item) => ({
  // ...item把item 浅copy成新的
  ...item,
  // ar: item['ar']->建立一個名為ar的屬性在新的array裡，值為item['ar']
  // 用正規表達式避免重複替換，g->golbal，i->不分大小寫
  ar: item['ar'].replace(new RegExp(keyword.value, 'gi'), (match) => {
    return `<span class="${catchkeyword.value}">${match}</span>`
  })
}))
console.log(afterHighlightData)

// 排序
// 排序圖示
const caretUpTotal = ref('bi bi-caret-up')
const caretDownTotal = ref('bi bi-caret-down')
const caretUpRent = ref('bi bi-caret-up')
const caretDownRent = ref('bi bi-caret-down')
// 排序值
const currentConditon = ref('')
const currentOrder = ref('')

function sortBy(condition, order) {
  // 排序圖示改變

  if (order == 'up' && condition == 'total') {
    caretUpTotal.value = 'bi bi-caret-up-fill'
    caretDownTotal.value = 'bi bi-caret-down'
    caretUpRent.value = 'bi bi-caret-up'
    caretDownRent.value = 'bi bi-caret-down'
  } else if (order == 'down' && condition == 'total') {
    caretDownTotal.value = 'bi bi-caret-down-fill'
    caretUpTotal.value = 'bi bi-caret-up'
    caretUpRent.value = 'bi bi-caret-up'
    caretDownRent.value = 'bi bi-caret-down'
  } else if (order == 'up' && condition == 'available_rent_bikes') {
    caretUpRent.value = 'bi bi-caret-up-fill'
    caretDownRent.value = 'bi bi-caret-down'
    caretUpTotal.value = 'bi bi-caret-up'
    caretDownTotal.value = 'bi bi-caret-down'
  } else if (order == 'down' && condition == 'available_rent_bikes') {
    caretDownRent.value = 'bi bi-caret-down-fill'
    caretUpRent.value = 'bi bi-caret-up'
    caretUpTotal.value = 'bi bi-caret-up'
    caretDownTotal.value = 'bi bi-caret-down'
  }

  currentConditon.value = condition
  currentOrder.value = order == 'down' ? 1 : -1
}
//排序後
const stationInfoSort = computed(() => {
  return afterSearchData.value.sort(
    (a, b) => currentOrder.value * (a[currentConditon.value] - b[currentConditon.value])
  )
})

const pageSize = ref(10)
const currentPage = ref(1) //目前所在的頁數

// 分頁

// computed 有偵測到響應式變數改變就觸發
const stationInfo_sliced = computed(() => {
  // 每頁20筆資料
  return stationInfoSort.value.slice(20 * (currentPage.value - 1), 20 * currentPage.value)
})

// 下一頁
function nextPage() {
  currentPage.value++
}

// 上一頁
function previousPage() {
  currentPage.value++
}

// 跳頁
function goToPage(pageNumber) {
  currentPage.value = pageNumber
}

// 總頁數
totalPageLength = computed(() => {
  return stationInfoSort.value.length //總頁數
})
console.log('totalpage: ', totalPageLength.value)

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
      <div class="col-auto">
        <!-- @input="onInput" -->
        <!-- @compositionend="onInput" for 中文輸入，但刪除自感應不到 -->
        <input v-model="keyword" type="text" class="form-control" placeholder="輸入站點地址" />
      </div>
      <div class="col-auto"><button type="button" class="btn btn-primary">查詢</button></div>
    </div>

    <hr />
    <!-- 中 -->
    <table class="table table-hover">
      <thead>
        <tr class="table-primary text-center">
          <th>站點編號</th>
          <th>站點名稱</th>
          <th>站點所在區域</th>
          <th>站點地址</th>
          <th>
            <div class="flex items-center justify-center">
              <span>總車位數量</span>
              <span>
                <i @click="sortBy('total', 'up')" :class="caretUpTotal"></i>
                <i @click="sortBy('total', 'down')" :class="caretDownTotal"></i>
              </span>
            </div>
          </th>
          <th>
            <div class="flex items-center justify-center">
              <span> 可租借的腳踏車數量 </span>
              <div class="icon-container">
                <span>
                  <i @click="sortBy('available_rent_bikes', 'up')" :class="caretUpRent"> </i>
                  <i @click="sortBy('available_rent_bikes', 'down')" :class="caretDownRent"> </i>
                </span>
              </div>
            </div>
          </th>
          <th>站點緯度</th>
          <th>站點經度</th>
          <th>可歸還的腳踏車數量</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="(dataitem, index) in stationInfoSort" :key="index">
          <td>{{ dataitem['sno'] }}</td>
          <td>{{ dataitem['sna'] }}</td>
          <td>{{ dataitem['sarea'] }}</td>
          <td v-html="dataitem['ar']"></td>
          <!-- <td>{{ dataitem['ar'] }}</td> -->
          <td>{{ dataitem['total'] }}</td>
          <td>{{ dataitem['available_rent_bikes'] }}</td>
          <td>{{ dataitem['latitude'] }}</td>
          <td>{{ dataitem['longitude'] }}</td>
          <td>{{ dataitem['available_return_bikes'] }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 下 -->
    <nav aria-label="...">
      <ul class="pagination justify-content-center">
        <li @click="previousPage" class="page-item">
          <a class="page-link" href="#">上一頁</a>
        </li>
        <li
          v-for="pageNumber in 10"
          :key="pageNumber"
          class="page-item"
          :class="{ active: currentPage === pageNumber }"
        >
          <a @click="goToPage(pageNumber)" class="page-link" href="#">{{ pageNumber }}</a>
        </li>
        <li class="page-item">
          <a @click="nextPage" class="page-link" href="#">下一頁</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.table-hover > tbody > tr:hover > td {
  background-color: #cfe2ff;
}

.catch {
  color: red;
  font-weight: bold;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  display: flex;
  flex-direction: column;
}
</style>
