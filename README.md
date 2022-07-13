# RealtimeQuakeInfo
RealtimeQuakeInfoのソースコードです。  
[http://nanka.html.xdomain.jp/html/RealtimeQuakeInfo/](http://nanka.html.xdomain.jp/html/RealtimeQuakeInfo/) にて公開しております。

 **かなり読みにくいコードです。** すみません。  
また、コードの転用なども可能です。  
ぜひ自分流に改造してお使いくださいませ。  

## 概要
![realtimequakeinfo_test5kyo](https://user-images.githubusercontent.com/90699739/178728505-cc8ee5f8-6ad4-486d-b74d-e55998da9f6d.jpg)
震度5強を受信したときの配色一覧です。

緊急地震速報をWebブラウザ上で受信できます。  
地震情報は「Yahoo!地震情報」様と「強震-地震アラート」様からご提供いただいております。

## 仕様
- 最初からリプレイをしたいときには、URLのパラメーターに「?replay_daytime=(14桁の数字)」を入力してください。  
(14桁の数字)は、年月日時分秒の14桁です。  
` 例 2022/07/03 15:05:15 の場合「?replay_daytime=20220703150515」 `
