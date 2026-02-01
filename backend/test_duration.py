import requests
import json

response = requests.get("http://localhost:8000/api/v1/programs?limit=5")
data = response.json()

print("\nPremiers 5 programmes avec duree:")
print("=" * 80)
for i, prog in enumerate(data['programs'][:5], 1):
    duration = prog.get('duration_years', 'N/A')
    print(f"{i}. {prog['name']}")
    print(f"   Niveau: {prog['level']} | Duree: {duration} ans | Emploi: {prog['employment_rate']}%")
    print()
