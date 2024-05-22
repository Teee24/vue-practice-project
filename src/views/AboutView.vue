<script setup>
import { ref, computed } from 'vue'

const pageSize = 10
const pageStart = ref(0)

const keyword = ref('')
const data = ref([])
const result = ref([])
const catchkeyword = ref('catch')

async function fetchData() {
  const res = await fetch(
    `https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json`
  )
  data.value = await res.json()
  console.log(data.value)
}
fetchData()
function onInput(e) {
  keyword.value = e.target.value
  console.log('keyword.value:', keyword.value)

  result.value = data.value.filter((item) => item['ar'].match(keyword.value))

  console.log('Origin: ', data.value)
  console.log('After:', result.value)
}

const datas = computed(() => {
  return keyword.value == '' ? data.value : result.value
})
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
    <table class="table table-hover table-striped">
      <thead>
        <tr class="table-primary">
          <th>站點編號</th>
          <th>站點名稱</th>
          <th>站點所在區域</th>
          <th>站點地址</th>
          <th>總車位數量</th>
          <th>可租借的腳踏車數量</th>
          <th>站點緯度</th>
          <th>站點經度</th>
          <th>可歸還的腳踏車數量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dataitem, index) in datas" :key="index">
          <td>{{ dataitem['sno'] }}</td>
          <td>{{ dataitem['sna'] }}</td>
          <td>{{ dataitem['sarea'] }}</td>
          <td>
            {{ dataitem['ar'] }}
            <!-- <span :class="catchkeyword">{{ keyword }}</span> -->
          </td>
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
          <a class="page-link" href="#">下一頁</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
/* :hover {
  background-color: lightskyblue;
} */
.catch {
  color: red;
}
</style>
