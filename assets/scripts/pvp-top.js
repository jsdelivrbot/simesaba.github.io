fetch('http://new.simesaba.online:3000/pvp-top')
  .then(x => x.json())
  .then(scores => {
    $(() => {
      let body = $('#body');
      let table = $('<table>');
      let thead = $('<thead><tr><th>順位</th><th>プレイヤー名</th><th>レート</th><th>キル数</th><th>死亡数</th></tr></thead>');
      let tbody = $('<tbody>');
      scores.forEach((score, i) => {
        let name = `<td><a href="http://new.simesaba.online/gamedata/player?id=${score.uid}">${score.name}</a></td>`;
        let tr = $(`<tr><td>${i + 1}</td>${name}<td>${score.elo}</td><td>${score.kills}</td><td>${score.deaths}</td></tr>`);
        tbody.append(tr);
      })
      table.append(thead);
      table.append(tbody);
      body.append(table);
    });
  });
