<template>
  <div class="carousel-container">
    <el-carousel trigger="click" arrow="never" style="height: 394px;">
      <el-carousel-item v-for="item in images" :key="item" style="height: 394px;">
        <el-image :src="item" object-fit="cover" fit="cover" />
      </el-carousel-item>
    </el-carousel>
    <div class="carousel-nav">
      <div class="navigator">
        <div v-for="item in navlist" :key="item.key" class="nav-item">
          <div class="left-section">
            <h4>
              <el-image :src="item.icon" object-fit="cover" fit="cover"
                style="width: 20px; height: 20px; margin-top: 4px;" /> {{ item.label }}
            </h4>
            <p class="detail">
              <span class="detail-item" v-for="child in item.children" :key="child.key"
                @click="router.push(`/bank/${child.key}`)">{{ child.label }}</span>
            </p>
          </div>
          <div class="right-hidden-section">
            <div v-for="child in item.children" :key="child.key" class="detail-item">
              {{ child.label }}
            </div>
          </div>
        </div>
        <div style="width: 100%;">
          <el-button type="primary" size="small" style="width: 100%;">更多</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-nav-container">
    <div class="bottom-navi">
      <div class="bottom-navi-item" v-for="item in bottomNaviList" :key="item.title">
        <p>{{ item.title }}</p>
        <p>{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';

const images = [
  new URL('@/assets/images/1.webp', import.meta.url).href,
  new URL('@/assets/images/2.webp', import.meta.url).href,
  new URL('@/assets/images/3.png', import.meta.url).href,
  new URL('@/assets/images/4.webp', import.meta.url).href,
  new URL('@/assets/images/5.webp', import.meta.url).href,
  new URL('@/assets/images/6.png', import.meta.url).href,
  new URL('@/assets/images/7.webp', import.meta.url).href,
  new URL('@/assets/images/8.webp', import.meta.url).href,
]

const navlist = [
  {
    key: '考研学科',
    label: '考研学科',
    children: [{
      key: '1',
      label: '计算机',
    }, {
      key: '3',
      label: '金融',
    }],
    icon: new URL('@/assets/icon/navi/1.png', import.meta.url).href
  },
  {
    key: '高考刷题',
    label: '高考刷题',
    children: [{
      key: '4',
      label: '物理',
    }, {
      key: '5',
      label: '化学',
    }, {
      key: '6',
      label: '生物',
    }],
    icon: new URL('@/assets/icon/navi/2.png', import.meta.url).href
  },
  {
    key: '编程语言',
    label: '编程语言',
    children: [{
      key: '7',
      label: 'java',
    }, {
      key: '8',
      label: 'python',
    }, {
      key: '9',
      label: 'javascript',
    }],
    icon: new URL('@/assets/icon/navi/3.png', import.meta.url).href
  },
  {
    key: '开发框架',
    label: '开发框架',
    children: [{
      key: '10',
      label: 'springboot',
    }, {
      key: '11',
      label: 'vue',
    }, {
      key: '12',
      label: 'nestjs',
    }],
    icon: new URL('@/assets/icon/navi/4.png', import.meta.url).href
  },
  {
    key: '考公考编',
    label: '考公考编',
    children: [{
      key: '13',
      label: '公务员',
    }, {
      key: '14',
      label: '辅警招聘',
    }],
    icon: new URL('@/assets/icon/navi/5.png', import.meta.url).href
  }
]
const bottomNaviList = [
  { icon: 'upload', title: '上传题库', desc: '快速批量导入试题' },
  { icon: 'exam', title: '发起考试', desc: '智能评分和防作弊' },
  { icon: '人工导题', title: '人工导题', desc: '内容团队高效导题' },
  { icon: 'search', title: '搜索试题', desc: '免费搜题，答案秒出' },
  { icon: 'download', title: '文档下载', desc: '免费资料持续更新' }
]
</script>
<style scoped>
:deep(.el-carousel__item) {
  height: 394px;
}

:deep(.el-carousel__item img) {
  width: 100%;
  height: 394px;
  object-fit: cover;
}

.carousel-container {
  width: 100%;
  position: relative;

  .carousel-nav {
    height: 100%;
    width: 1200px;
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);

    .navigator {
      height: 100%;
      width: 280px;
      display: flex;
      align-items: center;
      flex-direction: column;
      background-color: #fff;
      position: relative;

      .nav-item {
        margin-bottom: 8px;
        height: 66px;
        width: 100%;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          .right-hidden-section {
            display: block;
          }
        }

        .left-section {
          padding: 4px 8px 0;
          border-bottom: 1px solid #E5E5E5;

          &:last-child {
            border-bottom: none;
          }

          h4 {
            margin: 0 0 12px 0;
          }

          .detail {
            font-size: 14px;
            line-height: 18px;
            color: #666;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 4px;

            .detail-item {
              cursor: pointer;

              &:hover {
                color: #92DEFB;
              }
            }
          }

        }

        .right-hidden-section {
          display: none;
          position: absolute;
          right: 0;
          top: 0;
          transform: translateX(100%);
          width: 920px;
          height: 394px;
          background-color: #fff;
        }
      }
    }
  }
}

.bottom-nav-container {
  background-color: #F3F8FE;
}

.bottom-navi {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.bottom-navi-item {
  flex: 1;
  text-align: center;
  height: 110px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
