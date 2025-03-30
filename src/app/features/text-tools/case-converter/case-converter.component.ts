import { Component } from '@angular/core';

@Component({
  selector: 'app-case-converter',
  templateUrl: './case-converter.component.html',
  styleUrl: './case-converter.component.css'
})
export class CaseConverterComponent {
  inputText: string = '';
  outputText: string = '';

  // 轉換為全部大寫
  convertToUppercase(): void {
    this.outputText = this.inputText.toUpperCase();
  }

  // 轉換為全部小寫
  convertToLowercase(): void {
    this.outputText = this.inputText.toLowerCase();
  }

  // 轉換為標題式大小寫（每個單詞首字母大寫）
  convertToTitleCase(): void {
    this.outputText = this.inputText.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  // 轉換為句子式大小寫（每個句子首字母大寫）
  convertToSentenceCase(): void {
    this.outputText = this.inputText.toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => {
        return match.toUpperCase();
      });
  }

  // 轉換為大小寫互換（大寫變小寫，小寫變大寫）
  convertToToggleCase(): void {
    this.outputText = this.inputText.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
  }

  // 轉換為交替大小寫（奇數位置小寫，偶數位置大寫）
  convertToAlternatingCase(): void {
    this.outputText = this.inputText.split('').map((char, index) => {
      return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    }).join('');
  }

  // 清空輸入文字
  clearText(): void {
    this.inputText = '';
    this.outputText = '';
  }

  // 從剪貼簿貼上文字
  async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText = text;
    } catch (err) {
      console.error('無法從剪貼簿讀取：', err);
      alert('無法從剪貼簿讀取。請確保您已授予剪貼簿權限。');
    }
  }

  // 將結果複製到剪貼簿
  copyToClipboard(): void {
    if (!this.outputText) return;
    
    navigator.clipboard.writeText(this.outputText)
      .then(() => {
        alert('已複製到剪貼簿');
      })
      .catch(err => {
        console.error('複製到剪貼簿失敗：', err);
        alert('複製到剪貼簿失敗。請確保您已授予剪貼簿權限。');
      });
  }
}
