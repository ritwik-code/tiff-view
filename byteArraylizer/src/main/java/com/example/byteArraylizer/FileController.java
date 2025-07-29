package com.example.byteArraylizer;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FileController {

    // Map mime types to file paths (customize as needed)
    private static final Map<String, String> MIME_TYPE_TO_PATH = new HashMap<>() {{
        put("image/jpeg", "C:/Users/91917/Projects/tiff-view/byteArraylizer/src/main/resources/static/sample.jpg");
        put("image/tiff", "C:/Users/91917/Projects/tiff-view/byteArraylizer/src/main/resources/static/sample.tif");
        // Add more mappings as needed
    }};

    @GetMapping("/file")
    public ResponseEntity<Resource> getFileByMimeType(@RequestParam String mimeType) throws IOException {
        String filePath = MIME_TYPE_TO_PATH.get(mimeType);
        if (filePath == null) {
            return ResponseEntity.badRequest().body(null);
        }
        File file = new File(filePath);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        byte[] data = Files.readAllBytes(file.toPath());
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.parseMediaType(mimeType))
                .contentLength(data.length)
                .body(resource);
    }
}
