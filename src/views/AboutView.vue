<script setup>
import { ref, computed, onMounted } from 'vue'

const pageSize = ref(10)
const pageStart = ref(0)
const currentPage = ref(1)

const catchkeyword = ref('catch')
const keyword = ref('')
const beforeSearchData = ref([])
const afterSearchData = ref([])

async function fetchData() {
  const res = await fetch(
    `https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json`
  )
  beforeSearchData.value = await res.json()
  stationInfo.value = beforeSearchData.value
  console.log('setup:', stationInfo.value)
}

fetchData()

//關鍵字搜尋
function onInput(e) {
  keyword.value = e.target.value
  //先篩出資料
  afterSearchData.value = beforeSearchData.value.filter((item) => item['ar'].match(keyword.value))
  // 標出關鍵字
  //用map會傳回新的array
  afterSearchData.value = afterSearchData.value.map((item) => ({
    // ...item把item 浅copy成新的
    ...item,
    //ar: item['ar']->建立一個名為ar的屬性在新的array裡，值為item['ar']
    //用正輝表達式避免重複替換，g->golbal，i->不分大小寫
    ar: item['ar'].replace(new RegExp(keyword.value, 'gi'), (match) => {
      return `<span class="${catchkeyword.value}">${match}</span>`
    })
  }))
}

const stationInfo = computed(() => {
  return keyword.value == '' ? beforeSearchData.value : afterSearchData.value
})

//排序
function sortBy(condition, order) {
  console.log(condition)
  if (condition == 'total' && order == 'down') {
    // 總車位數量，降冪
    stationInfo.value = beforeSearchData.value.sort((a, b) => b.total - a.total)
  } else if (condition == 'available_rent_bikes' && order == 'down') {
    // 可租借的腳踏車數量，降冪
    stationInfo.value = beforeSearchData.value.sort(
      (a, b) => b.available_rent_bikes - a.available_rent_bikes
    )
  } else if (condition == 'available_rent_bikes' && order == 'up') {
    // 可租借的腳踏車數量，升冪
    stationInfo.value = beforeSearchData.value.sort(
      (a, b) => a.available_rent_bikes - b.available_rent_bikes
    )
  } else if (condition == 'total' && order == 'up') {
    // 總車位數量，升冪
    stationInfo.value = beforeSearchData.value.sort((a, b) => a.total - b.total)
  }
}

//下一頁
function nextPage() {
  currentPage.value++
  beforeSearchData.value = beforeSearchData.value.slice(
    currentPage.value + pageSize.value + 1,
    pageStart.value + pageSize.value + 1
  )
}

// onMounted(() => {
//
//   console.log('Mounted :', stationInfo.value)
//   //切分資料
//   const stationInfo_sliced = stationInfo.value.slice(
//     pageStart,
//     pageStart.value + pageSize.value + 1
//   )
// })
</script>

<template>
  <div class="container-xxl">
    <!-- 上 -->
    <div class="row g-3">
      <div class="col-auto">
        <!-- @input="onInput" -->
        <!-- @compositionend="onInput" for 中文輸入，但刪除自感應不到 -->
        <input
          @input="onInput"
          :value="keyword"
          type="text"
          id="keyword"
          class="form-control"
          placeholder="輸入站點地址"
        />
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
          <th @click="sortBy('total', 'down')">總車位數量</th>
          <th @click="sortBy('available_rent_bikes', 'down')">可租借的腳踏車數量</th>
          <th>站點緯度</th>
          <th>站點經度</th>
          <th>可歸還的腳踏車數量</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="(dataitem, index) in stationInfo" :key="index">
          <td>{{ dataitem['sno'] }}</td>
          <td>{{ dataitem['sna'] }}</td>
          <td>{{ dataitem['sarea'] }}</td>
          <td v-html="dataitem['ar']"></td>
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
        <li class="page-item disabled">
          <a class="page-link">上一頁</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
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

.table-hover > thead :hover {
  background-color: lightskyblue;
  color: azure;
}
.catch {
  color: red;
  font-weight: bold;
}
</style>
