<template>
  <div
    class="storyblok-html-renderer"
    :class="cssClasses"
    :style="styles"
  >
    <div class="_no-script-html"
         v-html="noScriptHtml"
    />

    <div class="_script-container" ref="script-container" />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

import HtmlData from './interfaces/html-data.interface';

export default Blok.extend({
  name: 'StoryblokHtmlRenderer',
  computed: {
    itemData (): HtmlData {
      return this.item as HtmlData;
    },
    noScriptHtml (): string {
      if (this.doesHtmlContainScript) {
        return '';
      }

      return this.itemData.html;
    },
    doesHtmlContainScript (): boolean {
      return this.itemData.html.includes('<script');
    }
  },
  mounted (): void {
    if (!this.doesHtmlContainScript) {
      return;
    }

    this.setHtml(this.itemData.html);
  },
  methods: {
    setHtml (html: string): void {
      const container = this.$refs['script-container'] as HTMLElement | undefined;
      if (!container) {
        return;
      }

      container.innerHTML = html;
      const scriptTags: HTMLScriptElement[] = Array.from(container.querySelectorAll('script'));

      for (const oldScript of scriptTags) {
        const newScript = document.createElement('script');
        const scriptAttributes: Attr[] = Array.from(oldScript.attributes);

        for (const attr of scriptAttributes) {
          newScript.setAttribute(attr.name, attr.value);
        }

        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.storyblok-html-renderer {
}
</style>
