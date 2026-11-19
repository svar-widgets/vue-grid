export function resize(node, config) {
	let x, dx, y, dy;

	function down(ev) {
		x = ev.clientX;
		y = ev.clientY;

		node.style.opacity = 1;

		document.body.style.cursor =
			config?.target === "column" ? "ew-resize" : "ns-resize";
		document.body.style.userSelect = "none";

		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);

		if (config && config.down) config.down(node);
	}

	function move(ev) {
		dx = ev.clientX - x;
		dy = ev.clientY - y;

		if (config && config.move) config.move({ dx, dy });
	}

	function up() {
		node.style.opacity = "";

		document.body.style.cursor = "";
		document.body.style.userSelect = "";

		if (config && config.up) config.up({ dx, dy });

		window.removeEventListener("mousemove", move);
		window.removeEventListener("mouseup", up);
	}

	const stopClick = (ev) => ev.stopPropagation();
	
	node.addEventListener("mousedown", down);
    node.addEventListener('click', stopClick);
    
	return {
		destroy() {
            node.removeEventListener("mousedown", down);
			node.removeEventListener('click', stopClick);
		},
	};
}
