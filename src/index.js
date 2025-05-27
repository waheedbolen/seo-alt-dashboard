export default {
	async fetch(request, env) {
	  const url = new URL(request.url);
	  const pathname = url.pathname;
	  const method = request.method;
  
	  // ✅ 1. Handle preflight request BEFORE auth check
	  if (method === "OPTIONS") {
		return new Response(null, {
		  status: 200,
		  headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, x-api-key"
		  }
		});
	  }
  
	  // ✅ 2. Auth check only for actual requests
	  const auth = request.headers.get("x-api-key");
	  if (auth !== env.DASHBOARD_API_KEY) {
		return new Response("Unauthorized", {
		  status: 403,
		  headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, x-api-key"
		  }
		});
	  }
  
	  // ✅ 3. Actual endpoints
	  if (pathname === "/stats" && method === "GET") {
		const list = await env.SEO_ALT_KV.list({ limit: 1000 });
		const totalRecords = list.keys.length;
		const mockApiCalls = Math.floor(totalRecords * 1.2);
  
		return new Response(JSON.stringify({
		  total_kv_entries: totalRecords,
		  mock_api_calls: mockApiCalls,
		  timestamp: new Date().toISOString()
		}), {
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		  }
		});
	  }
  
	  if (pathname === "/kv" && method === "GET") {
		const list = await env.SEO_ALT_KV.list({ limit: 100 });
		const results = await Promise.all(
		  list.keys.map(async (key) => {
			const value = await env.SEO_ALT_KV.get(key.name);
			return { image: key.name, alt: value };
		  })
		);
  
		return new Response(JSON.stringify(results), {
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		  }
		});
	  }
  
	  if (pathname === "/kv" && method === "POST") {
		let body;
		try {
		  body = await request.json();
		} catch {
		  return new Response("Invalid JSON", { status: 400 });
		}
  
		if (!body.image || !body.alt) {
		  return new Response("Missing image or alt", { status: 400 });
		}
  
		await env.SEO_ALT_KV.put(body.image, body.alt);
  
		return new Response(JSON.stringify({ success: true }), {
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		  }
		});
	  }
  
	  return new Response("Not Found", { status: 404 });
	}
  };
