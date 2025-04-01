import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimeUnit {
  name: string;
  toMilliseconds: (value: number) => number;
  fromMilliseconds: (value: number) => number;
}

@Component({
  selector: 'app-time-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-converter.component.html'
})
export class TimeConverterComponent {
  timeUnits: TimeUnit[] = [
    {
      name: '毫秒',
      toMilliseconds: (v: number) => v,
      fromMilliseconds: (v: number) => v
    },
    {
      name: '秒',
      toMilliseconds: (v: number) => v * 1000,
      fromMilliseconds: (v: number) => v / 1000
    },
    {
      name: '分鐘',
      toMilliseconds: (v: number) => v * 60 * 1000,
      fromMilliseconds: (v: number) => v / (60 * 1000)
    },
    {
      name: '小時',
      toMilliseconds: (v: number) => v * 60 * 60 * 1000,
      fromMilliseconds: (v: number) => v / (60 * 60 * 1000)
    },
    {
      name: '天',
      toMilliseconds: (v: number) => v * 24 * 60 * 60 * 1000,
      fromMilliseconds: (v: number) => v / (24 * 60 * 60 * 1000)
    },
    {
      name: '週',
      toMilliseconds: (v: number) => v * 7 * 24 * 60 * 60 * 1000,
      fromMilliseconds: (v: number) => v / (7 * 24 * 60 * 60 * 1000)
    }
  ];

  // 單位轉換
  fromUnit: TimeUnit = this.timeUnits[3]; // 預設小時
  toUnit: TimeUnit = this.timeUnits[2];   // 預設分鐘
  fromValue: number = 0;
  toValue: number = 0;

  // 時間計算
  time1: string = new Date().toISOString().slice(0, 16);
  time2Type: 'datetime' | 'duration' = 'datetime';
  time2: string = new Date().toISOString().slice(0, 16);
  operation: '+' | '-' = '+';
  duration: number = 0;
  durationUnit: TimeUnit = this.timeUnits[3]; // 預設小時
  result: string = '';

  // 常用時間間隔
  commonIntervals = [
    { value: 30, unit: this.timeUnits[2] },  // 30分鐘
    { value: 1, unit: this.timeUnits[3] },   // 1小時
    { value: 24, unit: this.timeUnits[3] },  // 24小時
    { value: 7, unit: this.timeUnits[4] }    // 7天
  ];

  convert() {
    if (this.fromValue === null || isNaN(this.fromValue)) {
      this.toValue = 0;
      return;
    }

    // 先轉換為毫秒
    const milliseconds = this.fromUnit.toMilliseconds(this.fromValue);
    // 再轉換為目標單位
    this.toValue = this.toUnit.fromMilliseconds(milliseconds);
  }

  calculateTimeDiff() {
    if (!this.time1) return;

    const time1Date = new Date(this.time1);
    let resultDate: Date;

    if (this.time2Type === 'datetime' && this.time2) {
      const time2Date = new Date(this.time2);
      if (this.operation === '+') {
        resultDate = new Date(time1Date.getTime() + (time2Date.getTime() - new Date(0).getTime()));
      } else {
        const diffMs = Math.abs(time1Date.getTime() - time2Date.getTime());
        this.result = this.formatDuration(diffMs);
        return;
      }
    } else if (this.time2Type === 'duration' && this.duration) {
      const durationMs = this.durationUnit.toMilliseconds(this.duration);
      resultDate = new Date(time1Date.getTime() + (this.operation === '+' ? durationMs : -durationMs));
    } else {
      return;
    }

    this.result = resultDate.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private formatDuration(milliseconds: number): string {
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    
    const parts = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小時`);
    if (minutes > 0) parts.push(`${minutes}分鐘`);
    
    return parts.join(' ');
  }

  usePreset(preset: { value: number, unit: TimeUnit }) {
    this.time2Type = 'duration';
    this.duration = preset.value;
    this.durationUnit = preset.unit;
    this.calculateTimeDiff();
  }
}
