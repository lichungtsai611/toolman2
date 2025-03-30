import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FormatterOptions {
  removeExtraSpaces: boolean;
  trimLines: boolean;
  removeEmptyLines: boolean;
  addPeriod: boolean;
  convertToFullWidth: boolean;
  addSpaceAfterPunctuation: boolean;
  textColor: string;
  fontSize: string;
}

@Component({
  selector: 'app-formatter',
  templateUrl: './formatter.component.html',
  styleUrl: './formatter.component.css'
})
export class FormatterComponent {
  inputText: string = '';
  formattedText: string = '';
  
  options: FormatterOptions = {
    removeExtraSpaces: true,
    trimLines: true,
    removeEmptyLines: false,
    addPeriod: false,
    convertToFullWidth: false,
    addSpaceAfterPunctuation: true,
    textColor: '',
    fontSize: ''
  };

  formatText(): void {
    let result = this.inputText;
    
    if (this.options.trimLines) {
      result = result.split('\n').map(line => line.trim()).join('\n');
    }
    
    if (this.options.removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }
    
    if (this.options.removeEmptyLines) {
      result = result.split('\n').filter(line => line.trim() !== '').join('\n');
    }
    
    if (this.options.convertToFullWidth) {
      // 半形轉全形的字元對照
      const halfToFull: Record<string, string> = {
        '!': '！', '"': '「', '#': '＃', '$': '＄', '%': '％',
        '&': '＆', "'": '\'', '(': '（', ')': '）', '*': '＊',
        '+': '＋', ',': '，', '-': '－', '.': '。', '/': '／',
        ':': '：', ';': '；', '<': '＜', '=': '＝', '>': '＞',
        '?': '？', '@': '＠', '[': '［', '\\': '＼', ']': '］',
        '^': '＾', '_': '＿', '`': '｀', '{': '｛', '|': '｜',
        '}': '｝', '~': '～'
      };
      
      result = result.split('').map(char => {
        return halfToFull[char] || char;
      }).join('');
    }
    
    if (this.options.addPeriod) {
      // 在中文句子末尾自動添加句號
      result = result.replace(/([^\s。！？：；,.!?:;])(?=\s|$)/g, '$1。');
    }
    
    if (this.options.addSpaceAfterPunctuation) {
      // 在標點符號後添加空格（除非後面已經有空格或是行尾）
      result = result.replace(/([。，！？：；,.!?:;])(?!\s|$)/g, '$1 ');
    }
    
    // 添加樣式類
    let formattedHtml = result;
    
    // 根據選項添加顏色和大小類
    let classes = [];
    if (this.options.textColor) {
      classes.push(this.options.textColor);
    }
    if (this.options.fontSize) {
      classes.push(this.options.fontSize);
    }
    
    if (classes.length > 0) {
      formattedHtml = `<div class="${classes.join(' ')}">${formattedHtml}</div>`;
    }
    
    this.formattedText = formattedHtml;
  }
  
  clearText(): void {
    this.inputText = '';
    this.formattedText = '';
  }
  
  copyInputText(): void {
    this.copyToClipboard(this.inputText);
  }
  
  copyFormattedText(): void {
    // 獲取純文本，移除HTML標籤
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.formattedText;
    const textToCopy = tempDiv.textContent || tempDiv.innerText || '';
    this.copyToClipboard(textToCopy);
  }
  
  async pasteText(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText = text;
      this.formatText();
    } catch (err) {
      console.error('無法從剪貼簿讀取：', err);
      alert('無法從剪貼簿讀取。請確保您已授予剪貼簿權限。');
    }
  }
  
  private copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('已複製到剪貼簿!');
    }).catch(err => {
      console.error('複製失敗：', err);
      alert('複製失敗。請確保您已授予剪貼簿權限。');
    });
  }
}
