<template>
  <div class="carousel-container">
    <el-carousel class="home-carousel" trigger="click" arrow="never">
      <el-carousel-item v-for="item in images" :key="item">
        <el-image :src="item" object-fit="cover" fit="cover" />
      </el-carousel-item>
    </el-carousel>
    <div class="carousel-nav">
      <div class="navigator">
        <div v-for="item in navlist" :key="item.key" class="nav-item">
          <div class="left-section">
            <h4>
              <el-image :src="item.icon" object-fit="cover" fit="cover" class="nav-icon" />
              {{ item.label }}
            </h4>
            <p class="detail">
              <span
                class="detail-item"
                v-for="child in item.children"
                :key="child.key"
                @click="$router.push(`/bank/${child.key}`)"
                >{{ child.label }}</span
              >
            </p>
          </div>
          <div class="right-hidden-section">
            <div v-for="child in item.grandChildren" :key="child.title" class="right-item">
              <h3>{{ child.title }}</h3>
              <span
                v-for="item in child.children"
                :key="item.key"
                @click="$router.push(`/bank/${item.key}`)"
                >{{ item.label }}</span
              >
            </div>
            <div class="right-item">
              <p class="more" @click="router.push('/bank/category')"><span>查看更多</span></p>
            </div>
          </div>
        </div>
        <div class="more-btn">
          <el-button type="primary" size="small" @click="$router.push('/bank/category')"
            >更多</el-button
          >
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-nav-container">
    <div class="bottom-navi">
      <div
        class="bottom-navi-item"
        v-for="item in bottomNaviList"
        :key="item.title"
        @click="$router.push(item.path)"
      >
        <el-image class="bottom-nav-icon" :src="item.icon" fit="cover" />
        <div class="text">
          <p class="title">{{ item.title }}</p>
          <p class="desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
  <section class="practice-section">
    <div class="practice-inner">
      <div class="online-header">
        <h2><span class="hot-icon">🔥</span> 大家都在练</h2>
        <a class="more-link" href="/bank/category">查看更多 ▸</a>
      </div>
      <div class="online-list">
        <div class="online-card" v-for="item in onlineCards" :key="item.title" :class="item.theme">
          <div class="card-content">
            <div class="card-tag">{{ item.tag }}</div>
            <p class="card-title">{{ item.title }}</p>
            <p class="card-desc">{{ item.desc }}</p>
          </div>
          <div class="card-visual">
            <span></span>
          </div>
        </div>
      </div>
      <h2 class="feature-title">多重核心功能，满足考试通关需求</h2>
      <div class="feature-grid">
        <div class="feature-card" v-for="item in featureCards" :key="item.title">
          <div class="feature-icon feature-sprite" :class="item.iconClass"></div>
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import router from '@/router'

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
    children: [
      {
        key: '1',
        label: '计算机',
      },
      {
        key: '2',
        label: '数一',
      },
    ],
    icon: new URL('@/assets/icon/navi/1.png', import.meta.url).href,
    grandChildren: [
      {
        title: '计算机',
        children: [
          {
            key: '1',
            label: '计算机',
          },
          {
            key: '2',
            label: '数一',
          },
        ],
      },
      {
        title: '计算机',
        children: [
          {
            key: '1',
            label: '计算机',
          },
          {
            key: '2',
            label: '数一',
          },
        ],
      },
    ],
  },
  {
    key: '高考刷题',
    label: '高考刷题',
    children: [
      {
        key: '4',
        label: '物理',
      },
      {
        key: '5',
        label: '化学',
      },
      {
        key: '6',
        label: '生物',
      },
    ],
    icon: new URL('@/assets/icon/navi/2.png', import.meta.url).href,
  },
  {
    key: '编程语言',
    label: '编程语言',
    children: [
      {
        key: '7',
        label: 'java',
      },
      {
        key: '8',
        label: 'python',
      },
      {
        key: '9',
        label: 'javascript',
      },
    ],
    icon: new URL('@/assets/icon/navi/3.png', import.meta.url).href,
  },
  {
    key: '开发框架',
    label: '开发框架',
    children: [
      {
        key: '10',
        label: 'springboot',
      },
      {
        key: '11',
        label: 'vue',
      },
      {
        key: '12',
        label: 'nestjs',
      },
    ],
    icon: new URL('@/assets/icon/navi/4.png', import.meta.url).href,
  },
  {
    key: '考公考编',
    label: '考公考编',
    children: [
      {
        key: '13',
        label: '公务员',
      },
      {
        key: '14',
        label: '辅警招聘',
      },
    ],
    icon: new URL('@/assets/icon/navi/5.png', import.meta.url).href,
  },
]
const bottomNaviList = [
  {
    icon: new URL('@/assets/images/naviBottom/test.png', import.meta.url).href,
    title: '公开题库',
    desc: '追踪练习，快速复习',
    path: '/bank/category',
  },
  {
    icon: new URL('@/assets/images/naviBottom/upload.png', import.meta.url).href,
    title: '上传题库',
    desc: 'AI助手批量导入试题',
    path: '/user/documents',
  },
  {
    icon: new URL('@/assets/images/naviBottom/user.png', import.meta.url).href,
    title: '我的空间',
    desc: '管理学习资料',
    path: '/user',
  },
  {
    icon: new URL('@/assets/images/naviBottom/search.png', import.meta.url).href,
    title: '搜索试题',
    desc: '免费搜题，答案秒出',
    path: '/search/question',
  },
  {
    icon: new URL('@/assets/images/naviBottom/download.png', import.meta.url).href,
    title: '文档下载',
    desc: '免费资料持续更新',
    path: '/documents',
  },
]

const onlineCards = [
  {
    tag: '2026最新整理',
    title: '银行业专业人员',
    desc: '职业资格考试',
    theme: 'theme-yellow',
  },
  {
    tag: '26新版 高效提分',
    title: '大学英语四六级',
    desc: '这次稳了！',
    theme: 'theme-purple',
  },
  {
    tag: '第25个',
    title: '全国安全生产月',
    desc: '2026专题题库',
    theme: 'theme-orange',
  },
  {
    tag: '马原 | 毛概 | 习概',
    title: '大学公共课',
    desc: '最新题库',
    theme: 'theme-beige',
  },
  {
    tag: '2026新版题库',
    title: '注册安全工程师',
    desc: '最新题库！',
    theme: 'theme-cyan',
  },
]

const featureCards = [
  {
    title: '顺序练习',
    iconClass: 'sprite-sequential',
  },
  {
    title: '随机练习',
    iconClass: 'sprite-random',
  },
  {
    title: '模拟考试',
    iconClass: 'sprite-mock-exam',
  },
  {
    title: '收藏练习',
    iconClass: 'sprite-past-paper',
  },
  {
    title: 'AI答疑',
    iconClass: 'sprite-chapter',
  },
  {
    title: '题型练习',
    iconClass: 'sprite-question-type',
  },
  {
    title: '高频考题',
    iconClass: 'sprite-hot-question',
  },
  {
    title: '错题练习',
    iconClass: 'sprite-wrong-favorite',
  },
]
</script>
<style scoped lang="scss">
.home-carousel {
  height: 394px;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-top: 4px;
}

.bottom-nav-icon {
  width: 50px;
  height: 50px;
}

:deep(.el-carousel__item) {
  height: 394px;
}

:deep(.el-carousel__item img) {
  width: 100%;
  height: 394px;
  object-fit: cover;
}

.more-btn {
  width: 100%;
  :deep(.el-button--small) {
    border-radius: 0;
    width: 100%;
  }
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
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 12px 24px;
            .right-item {
              h3 {
                color: #333;
                font-weight: 500px;
                margin: 0 0 8px 0;
                font-size: 16px;
              }
              span {
                color: #333;
                margin-right: 16px;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                  color: #198cff;
                }
              }
              .more {
                margin: 0;
                position: relative;
                span {
                  color: #198dff;
                  font-size: 14px;
                  font-weight: 450;
                }
                cursor: pointer;
                ::after {
                  position: absolute;
                  top: 50%;
                  transform: translate(0, -50%);
                  content: '';
                  width: 0;
                  height: 0;
                  margin-left: 4px;
                  border-top: 4px solid transparent;
                  border-bottom: 4px solid transparent;
                  border-left: 6px solid #198dff;
                }
              }
            }
          }
        }

        .left-section {
          padding: 4px 8px 0;
          border-bottom: 1px solid #e5e5e5;
          &:last-child {
            border-bottom: none;
          }
          &:hover {
            box-shadow:
              -4px 0 1px -2px #198cff inset,
              0 8px 24px rgba(214, 218, 227, 0.3);
            background-color: linear-gradient(180deg, #f6f9ff, #fff);
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
                color: #92defb;
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
  background-color: #f3f8fe;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-navi {
  width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  justify-items: center;
  align-items: center;
  gap: 0;
}

.bottom-navi-item {
  box-sizing: border-box;
  padding: 0 16px;
  text-align: center;
  height: 110px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 12px;
  &:hover {
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    .title,
    .desc {
      margin: 0;
      text-align: left;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
    }
    .desc {
      font-size: 14px;
      color: #333;
    }
  }
}

.practice-section {
  position: relative;
  background-color: #fff;
  padding: 12px 0 70px;
}

.practice-inner {
  width: 1200px;
  margin: 0 auto;
}

.online-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.online-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.hot-icon {
  margin-right: 8px;
}

.more-link {
  font-size: 14px;
  color: #198cff;
  text-decoration: none;
}

.online-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.online-card {
  min-height: 112px;
  border-radius: 8px;
  padding: 14px 16px;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border: 1px solid #eef3fb;
  background: #fff;
  box-shadow: 0 10px 28px rgba(36, 82, 144, 0.08);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.online-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.9;
  pointer-events: none;
}

.online-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: 14px;
  width: 3px;
  height: 54px;
  border-radius: 0 99px 99px 0;
  background: var(--card-accent);
}

.online-card:hover {
  border-color: rgba(75, 141, 255, 0.28);
  box-shadow: 0 16px 36px rgba(36, 82, 144, 0.14);
  transform: translateY(-3px);
}

.card-content {
  position: relative;
  z-index: 1;
  max-width: 138px;
}

.card-tag {
  display: inline-block;
  max-width: 126px;
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
  border-radius: 99px;
  overflow: hidden;
  color: var(--card-accent);
  background-color: var(--card-tag-bg);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card-title {
  margin: 12px 0 4px;
  font-size: 17px;
  line-height: 22px;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: #5f6b7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-visual {
  position: relative;
  z-index: 1;
  align-self: center;
  flex: 0 0 58px;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.4)),
    var(--card-visual-bg);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 10px 20px rgba(36, 82, 144, 0.12);
}

.card-visual::before,
.card-visual::after,
.card-visual span {
  content: '';
  position: absolute;
  border-radius: 99px;
  background: var(--card-accent);
}

.card-visual::before {
  left: 14px;
  top: 16px;
  width: 30px;
  height: 7px;
}

.card-visual::after {
  left: 14px;
  top: 29px;
  width: 22px;
  height: 7px;
  opacity: 0.72;
}

.card-visual span {
  right: 11px;
  bottom: 10px;
  width: 18px;
  height: 18px;
  box-shadow: -18px -2px 0 rgba(255, 255, 255, 0.68);
}

.theme-yellow {
  --card-accent: #f6a623;
  --card-tag-bg: #fff4d8;
  --card-visual-bg: linear-gradient(135deg, #fff0be, #fff9e8);
}

.theme-yellow::before {
  background: linear-gradient(135deg, rgba(255, 246, 216, 0.9), rgba(255, 255, 255, 0) 70%);
}

.theme-purple {
  --card-accent: #6b6ff4;
  --card-tag-bg: #eeeeff;
  --card-visual-bg: linear-gradient(135deg, #e9e9ff, #f7f9ff);
}

.theme-purple::before {
  background: linear-gradient(135deg, rgba(236, 235, 255, 0.96), rgba(255, 255, 255, 0) 70%);
}

.theme-orange {
  --card-accent: #ef6c2f;
  --card-tag-bg: #fff0e6;
  --card-visual-bg: linear-gradient(135deg, #ffe0cd, #fff7ef);
}

.theme-orange::before {
  background: linear-gradient(135deg, rgba(255, 238, 226, 0.95), rgba(255, 255, 255, 0) 70%);
}

.theme-beige {
  --card-accent: #c48a35;
  --card-tag-bg: #fff2df;
  --card-visual-bg: linear-gradient(135deg, #f8e2c4, #fff8ef);
}

.theme-beige::before {
  background: linear-gradient(135deg, rgba(255, 241, 222, 0.95), rgba(255, 255, 255, 0) 70%);
}

.theme-cyan {
  --card-accent: #19a7d8;
  --card-tag-bg: #e0f8ff;
  --card-visual-bg: linear-gradient(135deg, #c8f4ff, #f0fbff);
}

.theme-cyan::before {
  background: linear-gradient(135deg, rgba(222, 248, 255, 0.96), rgba(255, 255, 255, 0) 70%);
}

.feature-title {
  margin: 84px 0 52px;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  color: #1f2937;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 46px 92px;
}

.feature-card {
  height: 188px;
  border-radius: 10px;
  background: linear-gradient(180deg, #f8fbff, #fff);
  box-shadow: 0 18px 40px rgba(51, 108, 190, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
}

.feature-card:hover {
  box-shadow: 0 20px 46px rgba(51, 108, 190, 0.16);
  transform: translateY(-1px);
  transition:
    box-shadow 0.5s ease,
    transform 0.5s ease;
}

.feature-icon {
  width: 86px;
  height: 86px;
}

.feature-sprite {
  background-image: url('@/assets/images/featureCards/feature-icons-sheet.png');
  background-repeat: no-repeat;
  background-size: 400% 200%;
}

.sprite-sequential {
  background-position: 0 0;
}

.sprite-random {
  background-position: 33.333333% 0;
}

.sprite-mock-exam {
  background-position: 66.666667% 0;
}

.sprite-past-paper {
  background-position: 100% 0;
}

.sprite-chapter {
  background-position: 0 100%;
}

.sprite-question-type {
  background-position: 33.333333% 100%;
}

.sprite-hot-question {
  background-position: 66.666667% 100%;
}

.sprite-wrong-favorite {
  background-position: 100% 100%;
}

.feature-card p {
  margin: 14px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

@media (max-width: 1280px) {
  .practice-inner {
    width: calc(100% - 48px);
  }

  .online-list {
    gap: 16px;
  }

  .feature-grid {
    gap: 32px;
  }
}
@media (max-width: 767px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-card {
    height: 180px;
  }
  .online-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .home-carousel {
    height: 200px;
  }
  .carousel-nav {
    display: none;
  }
  .bottom-navi {
    grid-template-columns: repeat(2, 1fr);
    .bottom-navi-item {
      padding-left: 36px;
      height: 80px;
    }
  }
  :deep(.el-carousel__item img) {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}
</style>
