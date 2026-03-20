from fastapi import APIRouter, HTTPException, Query
import httpx
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

JSEARCH_API_KEY = os.getenv("JSEARCH_API_KEY", "")
JSEARCH_HOST = "jsearch.p.rapidapi.com"


@router.get("/jobs")
async def get_jobs(
    query: str = Query(...),
    remote: bool = Query(False),
    page: int = Query(1, ge=1, le=5),
):
    if not JSEARCH_API_KEY:
        raise HTTPException(status_code=503, detail="JSEARCH_API_KEY is not set in .env")

    search_query = f"{query} remote" if remote else query

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.get(
                f"https://{JSEARCH_HOST}/search",
                params={
                    "query": search_query,
                    "page": str(page),
                    "num_pages": "2",
                    "date_posted": "month",
                },
                headers={
                    "X-RapidAPI-Key": JSEARCH_API_KEY,
                    "X-RapidAPI-Host": JSEARCH_HOST,
                },
            )

        if response.status_code == 401:
            raise HTTPException(status_code=502, detail="JSearch API key is invalid (401). Re-check your key on RapidAPI dashboard.")

        if response.status_code == 403:
            raise HTTPException(status_code=502, detail="JSearch API key not subscribed or quota exceeded (403). Subscribe to the Basic plan on RapidAPI.")

        if response.status_code == 429:
            raise HTTPException(status_code=502, detail="JSearch rate limit hit (429). You've exceeded your free monthly quota.")

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"JSearch returned status {response.status_code}: {response.text[:200]}"
            )

        jobs_data = response.json().get("data", [])
        return {"success": True, "data": jobs_data, "count": len(jobs_data)}

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Job search timed out. Try again.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search failed: {str(e)}")
