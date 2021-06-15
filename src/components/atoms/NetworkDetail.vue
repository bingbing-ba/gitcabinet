<template>
  <div class="content">
    <!-- <p>{{ commit.hash }}</p> -->
    <p><Badge color="green">{{ shortHash }}</Badge> : {{ commit.message }}</p>
    <p class="commit-date">{{ date }}</p>
    <p class="commit-author" v-if="isUserName || isUserEmail">
      {{
        isUserEmail && isUserName
          ? `${commit.author.name} | ${commit.author.email}`
          : `${commit.author.name || commit.author.email}`
      }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { commit } from "@/git/gitTypes";
import Badge from "@/components/atoms/Badge.vue";

export default defineComponent({
  props: {
    commit: {
      type: Object as PropType<commit & { hash: string }>,
    },
  },
  components: {
    Badge,
  },
  setup(props) {
    const date = computed(() => {
      const dateInstance = new Date(Number(props.commit?.createdAt));
      const fullYear = dateInstance.getFullYear() % 100;
      const month = dateInstance.getMonth();
      const date = dateInstance.getDate();
      const hours = dateInstance.getHours();
      const minutes = dateInstance.getMinutes();
      const seconds = dateInstance.getSeconds();
      const day = ["일", "월", "화", "수", "목", "금", "토"][
        dateInstance.getDay()
      ];

      return `${fullYear}년 ${month}월 ${date}일 (${day}) ${hours}시 ${minutes}분 ${seconds}초`;
    });

    const shortHash = computed(() => {
      return props.commit?.hash.slice(0, 7);
    });

    const isUserName = computed(() => {
      return !!props.commit?.author.name;
    });
    const isUserEmail = computed(() => {
      return !!props.commit?.author.email;
    });

    return {
      date,
      shortHash,
      isUserName,
      isUserEmail,
    };
  },
});
</script>

<style>
.edge-line {
  height: 60px;
  width: 1px;
  border: 2px solid black;
}
.commit-author {
  @apply text-xs text-gray-500;
}
.commit-date {
  @apply text-xs text-gray-500;
}
</style>