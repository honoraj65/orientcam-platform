import requests
import json

response = requests.get("http://localhost:8000/api/v1/programs?limit=10")
data = response.json()

print("\nPremiers 10 programmes (nouveau classement):")
print("=" * 80)
for i, prog in enumerate(data['programs'], 1):
    print(f"{i:2}. Niveau: {prog['level']:10} | Emploi: {prog['employment_rate']:3}% | {prog['name']}")

print(f"\nTotal: {data['total']} programmes")
