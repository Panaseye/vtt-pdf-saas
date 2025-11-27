Endpoint

POST https://hooks.talezra.com/webhook/worker/v1/vtt-pdf

Header: x-worker-secret: <secret>

Form-data: file = (binary) .vtt / .srt / .txt / .pdf


Success

{
"ok": true,
"text": "cleaned transcript or extracted text",
"meta": {
"type": "pdf" | "vtt" | "srt" | "txt"
}
}


Errors

Invalid secret:

{ "ok": false, "error": "forbidden" }


No file / bad input:

{ "ok": false, "error": "no_file_provided" }


Failed to parse PDF:

{ "ok": false, "error": "pdf_parse_failed" }
