import requests

print('=== VERIFICATION PAGINATION ===\n')

for page_num in [1, 2, 3]:
    offset = (page_num - 1) * 12
    r = requests.get(f'http://localhost:8000/api/v1/programs?limit=12&offset={offset}')
    data = r.json()

    print(f'Page {page_num}:')
    print(f'  Programmes: {len(data["programs"])}')
    print(f'  Premier: {data["programs"][0]["name"]}')
    print(f'  Dernier: {data["programs"][-1]["name"]}')
    print()

print(f'Total affiche: {12 + 12 + 8} / {data["total"]}')
