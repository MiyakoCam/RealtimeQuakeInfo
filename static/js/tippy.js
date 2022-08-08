tippy('.cap', {
    placement: 'top',
    animation: 'perspective',
    duration: 200,
    allowHTML: true,
});
tippy('.set_replay_td1_tippy', {
    content: '<span style="font-size: 130%;font-weight: bold;color: red;">未来の日付・時刻を入力しないでください！</span><br>過去に発生した地震をリプレイで確認します。<br>現在の時刻に戻す場合、リプレイ停止を押してください。',
    placement: 'top',
    animation: 'perspective',
    duration: 200,
    allowHTML: true,
});
tippy('#error_mes_time', {
    content: '<span class="material-symbols-outlined ido" style="font-size: 2.3rem;">signal_wifi_bad</span>ネットワークエラーの可能性があります。<br>有効な、持続的なインターネット接続があるか確認してください。<br>このエラーは、ネットワークエラーが原因と考えられるため、設定の「自動リロード」に基づき再読み込み<span style="font-weight: bold;color: red;">されません</span>。',
    placement: 'top',
    animation: 'perspective',
    duration: 200,
    allowHTML: true,
});
tippy('#error_mes_info', {
    content: '遅延オフセットを調節してください。<br><span class="material-symbols-outlined ido">settings</span>設定の「遅延オフセット」を2秒以上に調節してから、<br>左上の<span class="material-symbols-outlined ido">refresh</span>更新ボタン、または、<span class="material-symbols-outlined ido">keyboard</span>F5キー、で再読み込みしてください。',
    placement: 'top',
    animation: 'perspective',
    duration: 200,
    allowHTML: true,
});
tippy('#error_mes_replay', {
    content: 'リプレイの時刻を未来の時刻にしないでください。<br>左上の<span class="material-symbols-outlined ido">refresh</span>更新ボタン、または、<span class="material-symbols-outlined ido">keyboard</span>F5キー、で再読み込みしてください。',
    placement: 'top',
    animation: 'perspective',
    duration: 200,
    allowHTML: true,
});