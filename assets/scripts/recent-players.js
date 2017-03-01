fetch('http://new.simesaba.online:3000/recent-players')
  .then(x => x.json())
  .then(players => {
    $(() => {
      let body = $('#body');
      let now = new Date();

      let ps1 = [], ps2 = [], ps3 = [], ps4 = [], ps5 = [];

      players.forEach(player => {
        let diff = now - player.lastPlayed;
        if (diff < dayToMillis(7)) {
          ps1.push(player);
        } else if (diff < dayToMillis(14)) {
          ps2.push(player);
        } else if (diff < dayToMillis(30)) {
          ps3.push(player);
        } else if (diff < dayToMillis(60)) {
          ps4.push(player);
        } else {
          ps5.push(player);
        }
      });

      $('<h3>').text('アクティブ').appendTo(body);
      ps1.forEach(player => showPlayer(player));
      $('<h3>').text('1週間前').appendTo(body);
      ps2.forEach(player => showPlayer(player));
      $('<h3>').text('2週間前').appendTo(body);
      ps3.forEach(player => showPlayer(player));
      $('<h3>').text('1ヶ月前').appendTo(body);
      ps4.forEach(player => showPlayer(player));
      $('<h3>').text('2ヶ月前').appendTo(body);
      ps5.forEach(player => showPlayer(player));

      function dayToMillis(day) {
        return day * 24 * 3600 * 1000;
      }

      function showPlayer(player) {
        $('<a>')
          .attr('href', `http://new.simesaba.online/gamedata/player?id=${player.uuid}`)
          .append($('<img>')
            .attr('src', `https://crafatar.com/avatars/${player.uuid}?size=64&overlay=1`)
            .attr('title', player.name))
          .appendTo(body);
      }
    });
  });
