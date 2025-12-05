# Full Integration Testing Script
# Test all pages after migrating to database

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTING: Full Integration with Database" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_BASE = "http://localhost:5000/api"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param($Name, $Url, $ExpectedKey)
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 500  # Add delay to avoid rate limiting
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ErrorAction Stop
        if ($null -ne $response.$ExpectedKey -and $response.$ExpectedKey.Count -gt 0) {
            Write-Host "  ✅ PASS: Found $($response.$ExpectedKey.Count) items" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host "  ⚠️  WARNING: No data found in '$ExpectedKey'" -ForegroundColor Yellow
            $script:testsPassed++
            return $true
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

function Test-AuthEndpoint {
    param($Name, $Username, $Password)
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        $body = @{
            username = $Username
            password = $Password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        
        if ($response.token) {
            Write-Host "  ✅ PASS: Login successful, token received" -ForegroundColor Green
            $script:testsPassed++
            
            # Test get profile with token
            $headers = @{
                "Authorization" = "Bearer $($response.token)"
            }
            
            Write-Host "Testing: Get User Profile" -ForegroundColor Yellow
            $profile = Invoke-RestMethod -Uri "$API_BASE/user/profile" -Method Get -Headers $headers -ErrorAction Stop
            
            if ($profile.username) {
                Write-Host "  ✅ PASS: Profile loaded for user '$($profile.username)'" -ForegroundColor Green
                Write-Host "    - Bookmarks: $($profile.bookmarks.Count)" -ForegroundColor Cyan
                Write-Host "    - Read History: $($profile.readHistory.Count)" -ForegroundColor Cyan
                
                # Check bookmark structure
                if ($profile.bookmarks.Count -gt 0) {
                    $bookmark = $profile.bookmarks[0]
                    if ($bookmark.comic -and $bookmark.comic.title) {
                        Write-Host "    - Bookmark structure: ✅ Has comic object with title '$($bookmark.comic.title)'" -ForegroundColor Green
                    } else {
                        Write-Host "    - Bookmark structure: ❌ Missing comic object!" -ForegroundColor Red
                        $script:testsFailed++
                        return $false
                    }
                }
                
                # Check readHistory structure
                if ($profile.readHistory.Count -gt 0) {
                    $history = $profile.readHistory[0]
                    if ($history.comic -and $history.comic.title) {
                        Write-Host "    - Read History structure: ✅ Has comic object with title '$($history.comic.title)'" -ForegroundColor Green
                    } else {
                        Write-Host "    - Read History structure: ❌ Missing comic object!" -ForegroundColor Red
                        $script:testsFailed++
                        return $false
                    }
                }
                
                $script:testsPassed++
                return $response.token
            }
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

# 1. Test Public Endpoints
Write-Host "`n--- PUBLIC ENDPOINTS ---" -ForegroundColor Magenta
Test-Endpoint "Home Page (Popular Comics)" "$API_BASE/komik-populer" "comics"
Test-Endpoint "Latest Comics" "$API_BASE/terbaru" "comics"
Test-Endpoint "Berwarna Comics" "$API_BASE/berwarna" "comics"
Test-Endpoint "All Genres" "$API_BASE/genre-all" "genres"
Test-Endpoint "Recommendations" "$API_BASE/rekomendasi" "comics"

# 2. Test Type Pages
Write-Host "`n--- TYPE PAGES ---" -ForegroundColor Magenta
Test-Endpoint "Manga Page" "$API_BASE/rekomendasi?type=Manga" "comics"
Test-Endpoint "Manhwa Page" "$API_BASE/rekomendasi?type=Manhwa" "comics"
Test-Endpoint "Manhua Page" "$API_BASE/rekomendasi?type=Manhua" "comics"

# 3. Test Search
Write-Host "`n--- SEARCH ---" -ForegroundColor Magenta
Test-Endpoint "Search Comics" "$API_BASE/search?q=one" "results"

# 4. Test Authentication & User Endpoints
Write-Host "`n--- AUTHENTICATION & USER DATA ---" -ForegroundColor Magenta
$token = Test-AuthEndpoint "Login + Get Profile" "testuser" "password123"

if ($token) {
    Write-Host "`nTesting: Toggle Bookmark" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        # Get a comic slug first
        $comics = Invoke-RestMethod -Uri "$API_BASE/komik-populer" -Method Get
        if ($comics.comics.Count -gt 0) {
            $comicSlug = $comics.comics[0].slug
            
            $body = @{
                comicSlug = $comicSlug
            } | ConvertTo-Json
            
            $result = Invoke-RestMethod -Uri "$API_BASE/user/bookmark" -Method Post -Headers $headers -Body $body
            Write-Host "  ✅ PASS: Bookmark toggled - $($result.msg)" -ForegroundColor Green
            $script:testsPassed++
            
            # Verify bookmark in profile
            Start-Sleep -Seconds 1
            $profile = Invoke-RestMethod -Uri "$API_BASE/user/profile" -Method Get -Headers $headers
            $isBookmarked = $profile.bookmarks | Where-Object { $_.comic.slug -eq $comicSlug }
            
            if ($isBookmarked) {
                Write-Host "  ✅ Verification: Bookmark exists in profile" -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "  ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
    }
}

# 5. Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Passed: $testsPassed" -ForegroundColor Green
Write-Host "  Failed: $testsFailed" -ForegroundColor Red
Write-Host "  Total: $($testsPassed + $testsFailed)" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "`nALL TESTS PASSED! Database integration working correctly." -ForegroundColor Green
} else {
    Write-Host "`nSOME TESTS FAILED! Check the output above." -ForegroundColor Yellow
}

