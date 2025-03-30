import { Component } from '@angular/core';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  chineseCharacters: number;
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  text: string = '';
  stats: TextStats = {
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    chineseCharacters: 0
  };
  readingTimeNormal: string = '0 分鐘';
  readingTimeFast: string = '0 分鐘';

  calculateStats(): void {
    // 計算基本統計資訊
    this.stats.characters = this.text.length;
    this.stats.charactersNoSpaces = this.text.replace(/\s+/g, '').length;
    
    // 計算單詞數量（考慮中英文混合情況）
    // 處理英文單詞
    const englishWords = this.text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // 計算中文字數
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const chineseMatches = this.text.match(chineseRegex);
    this.stats.chineseCharacters = chineseMatches ? chineseMatches.length : 0;
    
    // 總單詞數等於英文單詞數加中文字數
    this.stats.words = englishWords + this.stats.chineseCharacters;
    
    // 計算行數（按換行符分割）
    this.stats.lines = this.text.split(/\r\n|\r|\n/).length;
    
    // 計算段落數（按多個換行符分割）
    this.stats.paragraphs = this.text.split(/\r\n\s*\r\n|\r\s*\r|\n\s*\n/).filter(para => para.trim().length > 0).length;
    
    // 如果文本為空，確保段落數為0
    if (this.text.trim().length === 0) {
      this.stats.paragraphs = 0;
    }
    
    // 計算閱讀時間
    this.calculateReadingTime();
  }
  
  calculateReadingTime(): void {
    // 一般閱讀速度：每分鐘250個單詞/中文字
    const minutesNormal = this.stats.words / 250;
    // 快速閱讀速度：每分鐘400個單詞/中文字
    const minutesFast = this.stats.words / 400;
    
    this.readingTimeNormal = this.formatReadingTime(minutesNormal);
    this.readingTimeFast = this.formatReadingTime(minutesFast);
  }
  
  formatReadingTime(minutes: number): string {
    if (minutes < 1) {
      return '少於1分鐘';
    } else if (minutes < 60) {
      return `${Math.round(minutes)} 分鐘`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} 小時 ${remainingMinutes} 分鐘`;
    }
  }
  
  clearText(): void {
    this.text = '';
    this.calculateStats();
  }
  
  async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.text = text;
      this.calculateStats();
    } catch (err) {
      console.error('無法從剪貼簿讀取：', err);
      alert('無法從剪貼簿讀取。請確保您已授予剪貼簿權限。');
    }
  }
}
