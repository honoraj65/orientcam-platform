import requests

r = requests.get('http://localhost:8000/api/v1/programs?limit=12&offset=24')
data = r.json()

print(f'Page 3 (API):')
print(f'  Total: {data["total"]}')
print(f'  Programmes retournes: {len(data["programs"])}')

print(f'\nPremiers 5:')
for i, p in enumerate(data['programs'][:5], 1):
    print(f'  {i}. {p["level"]:10} - {p["name"]}')

print(f'\nDerniers 3:')
for i, p in enumerate(data['programs'][-3:], len(data['programs'])-2):
    print(f'  {i}. {p["level"]:10} - {p["name"]}')
