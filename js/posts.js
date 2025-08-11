<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>台中 XX 鬼屋</title>
  <style>
    body { font-family: Arial; background:#111; color:#eee; padding:20px; }
    a { color:#66ccff; }
  </style>
</head>
<body>
  <h1>台中 XX 鬼屋</h1>
  <p>這裡流傳著許多靈異事件……（示範文章內容）</p>
  <p><a href="index.html">⬅ 回首頁</a></p>

  <script>
    const NAMESPACE = "taiwan-horror-map";
    const today = new Date();
    const todayKey = `${today.getFullYear()}${today.getMonth()+1}${today.getDate()}`;
    const postId = "post1";

    // 當日點擊數 +1
    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${postId}_${todayKey}`);
  </script>
</body>
</html>
