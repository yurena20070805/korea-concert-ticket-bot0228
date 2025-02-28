async function sleep(t) {
    return await new Promise(resolve => setTimeout(resolve, t));
}

function theFrame() {
    if (window._theFrameInstance == null) {
      window._theFrameInstance = document.getElementById('oneStopFrame').contentWindow;
    }
    return window._theFrameInstance;
}

function getConcertId() {
    return document.getElementById("prodId").value;
}

function openEverySection() {
    let frame = theFrame();
    let section = frame.document.getElementsByClassName("seat_name");
    for (let i = 0; i < section.length; i++) {
        section[i].parentElement.click();
    }
}

function clickOnArea(area) {
    let frame = theFrame();
    let section = frame.document.getElementsByClassName("area_tit");
    for (let i = 0; i < section.length; i++) {
        let reg = new RegExp(area + "\$","g");
        if (section[i].innerHTML.match(reg)) {
            section[i].parentElement.click();
            return;
        }
    }
}

async function findSeat() {
    let frame = theFrame();
    let canvas = frame.document.getElementById("ez_canvas");
    let seat = canvas.getElementsByTagName("rect");
    await sleep(100); // 加速点1：从750ms改为100ms
    for (let i = 0; i < seat.length; i++) {
        let fillColor = seat[i].getAttribute("fill");
    
        if (fillColor !== "#DDDDDD" && fillColor !== "none") {
            seat[i].dispatchEvent(new Event('click', { bubbles: true }));
            return true; // 加速点2：移除自动点击下一步
        }
    }
    return false;
}

async function reload() {
    let frame = theFrame();
    frame.document.getElementById("btnReloadSchedule").click();
    await sleep(300); // 加速点3：从750ms改为300ms
}

async function searchSeat(data) {
    let maxRetries = 50; // 加速点4：添加循环上限
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        for (const sec of data.section) {
            openEverySection();
            clickOnArea(sec);
            if (await findSeat()) {
                alert("发现座位！请手动操作！");
                return; // 加速点5：直接返回不递归
            }
        }
        await reload(); // 加速点6：移除递归直接循环
    }
}

async function waitFirstLoad() {
    let concertId = getConcertId();
    let data = await get_stored_value(concertId);
    await sleep(100); // 加速点7：从1000ms改为100ms
    searchSeat(data);
}

waitFirstLoad();
