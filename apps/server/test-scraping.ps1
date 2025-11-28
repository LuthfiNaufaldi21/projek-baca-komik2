# Script untuk test scraping Komiku
# Cara pakai: .\test-scraping.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST SCRAPING KOMIKU API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# Test setiap endpoint
$endpoints = @(
    @{ Name = "Rekomendasi"; Path = "/rekomendasi"; Fields = @("title", "type", "slug") },
    @{ Name = "Terbaru"; Path = "/terbaru"; Fields = @("title", "type", "slug") },
    @{ Name = "Populer"; Path = "/komik-populer"; Fields = @("title", "type", "slug") },
    @{ Name = "Berwarna"; Path = "/berwarna"; Fields = @("title", "type", "slug") },
    @{ Name = "Pustaka"; Path = "/pustaka"; Fields = @("title", "type", "slug") },
    @{ Name = "Genre All"; Path = "/genre-all"; Fields = @("name", "slug") },
    @{ Name = "Search (One Piece)"; Path = "/search?q=One+Piece"; Fields = @("title", "type", "slug") }
)

foreach ($endpoint in $endpoints) {
    Write-Host "[TEST] $($endpoint.Name)" -ForegroundColor Yellow
    Write-Host "   URL: $baseUrl$($endpoint.Path)" -ForegroundColor Gray
    
    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri "$baseUrl$($endpoint.Path)" -UseBasicParsing -TimeoutSec 30
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data -is [array]) {
            $count = $data.Count
        } else {
            $count = 1
        }
        
        $durationStr = "{0:F2}" -f $duration
        Write-Host "   SUCCESS - $count items | $durationStr seconds" -ForegroundColor Green
        
        # Tampilkan 2 item pertama
        if ($count -gt 0) {
            Write-Host "   Sample data:" -ForegroundColor Cyan
            $data | Select-Object -First 2 | ForEach-Object {
                $fields = @{}
                foreach ($field in $endpoint.Fields) {
                    if ($_.PSObject.Properties.Name -contains $field) {
                        $fields[$field] = $_.$field
                    }
                }
                $fieldStr = ($fields.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" }) -join " | "
                Write-Host "      - $fieldStr" -ForegroundColor White
            }
        }
        
    } catch {
        Write-Host "   FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DETAIL KOMIK TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test detail komik
$testSlug = "one-piece"
Write-Host "[TEST] Detail: $testSlug" -ForegroundColor Yellow
Write-Host "   URL: $baseUrl/detail-komik/$testSlug" -ForegroundColor Gray

try {
    $startTime = Get-Date
    $response = Invoke-WebRequest -Uri "$baseUrl/detail-komik/$testSlug" -UseBasicParsing -TimeoutSec 30
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    $detail = $response.Content | ConvertFrom-Json
    
    $durationStr = "{0:F2}" -f $duration
    Write-Host "   SUCCESS | $durationStr seconds" -ForegroundColor Green
    Write-Host "   Detail:" -ForegroundColor Cyan
    Write-Host "      Title: $($detail.title)" -ForegroundColor White
    Write-Host "      Type: $($detail.type)" -ForegroundColor White
    Write-Host "      Author: $($detail.author)" -ForegroundColor White
    Write-Host "      Status: $($detail.status)" -ForegroundColor White
    Write-Host "      Rating: $($detail.rating)" -ForegroundColor White
    
    if ($detail.chapters) {
        $chapterCount = $detail.chapters.Count
        Write-Host "      Chapters: $chapterCount" -ForegroundColor White
    }
    
    if ($detail.genres) {
        $genreStr = $detail.genres -join ", "
        Write-Host "      Genres: $genreStr" -ForegroundColor White
    }
    
} catch {
    Write-Host "   FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   CHAPTER IMAGE TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test baca chapter
$testChapter = "1"
Write-Host "[TEST] Chapter: $testSlug - Chapter $testChapter" -ForegroundColor Yellow
Write-Host "   URL: $baseUrl/baca-chapter/$testSlug/$testChapter" -ForegroundColor Gray

try {
    $startTime = Get-Date
    $response = Invoke-WebRequest -Uri "$baseUrl/baca-chapter/$testSlug/$testChapter" -UseBasicParsing -TimeoutSec 30
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    $chapter = $response.Content | ConvertFrom-Json
    
    $durationStr = "{0:F2}" -f $duration
    Write-Host "   SUCCESS | $durationStr seconds" -ForegroundColor Green
    Write-Host "   Chapter Info:" -ForegroundColor Cyan
    Write-Host "      Title: $($chapter.title)" -ForegroundColor White
    Write-Host "      Chapter: $($chapter.chapter)" -ForegroundColor White
    
    if ($chapter.images) {
        $imageCount = $chapter.images.Count
        Write-Host "      Images: $imageCount pages" -ForegroundColor White
        
        # Tampilkan 3 URL gambar pertama
        if ($imageCount -gt 0) {
            Write-Host "      Sample images:" -ForegroundColor Cyan
            $chapter.images | Select-Object -First 3 | ForEach-Object {
                Write-Host "         - $_" -ForegroundColor Gray
            }
        }
    }
    
} catch {
    Write-Host "   FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   TEST COMPLETED" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green
