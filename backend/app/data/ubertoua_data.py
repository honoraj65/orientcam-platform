"""
Données structurées de l'Université de Bertoua
Extrait du document: Tableau Synoptique Bilingue des Offres de Formation 2025-2026
"""

# Structure hiérarchique: Établissement -> Département -> Filière -> Niveau -> UE

UBERTOUA_DATA = {
    "FSJP": {
        "name": "Faculté des Sciences Juridiques et Politiques",
        "departments": {
            "DROIT_PUBLIC": {
                "name": "Droit Public",
                "license_programs": [
                    {
                        "level": "Licence 3",
                        "name": "Droit Public",
                        "ue": [
                            "Droit constitutionnel",
                            "Droit administratif",
                            "Finances publiques",
                            "Droit fiscal",
                            "Institutions administratives"
                        ]
                    }
                ],
                "master_programs": [
                    {
                        "name": "Carrière Judiciaire",
                        "duration": "2 ans"
                    },
                    {
                        "name": "Droit public",
                        "duration": "2 ans"
                    }
                ],
                "professional_licenses": [
                    "Droit budgétaire, fiscal, douanier et des comptes publics",
                    "Gouvernance des Collectivités Territoriales Décentralisées",
                    "Stratégie, Défense, sécurité, gestion des conflits, et des catastrophes",
                    "Pratique juridique, juridictionnelle, et métiers du droit de la justice",
                    "Gouvernance des marchés publics, des partenariats publics et autres contrats publics",
                    "Droits minier et des ressources naturelles"
                ]
            },
            "DROIT_PRIVE": {
                "name": "Droit Privé",
                "license_programs": [
                    {
                        "level": "Licence 3",
                        "name": "Droit Privé",
                        "ue": [
                            "Droit civil",
                            "Droit commercial",
                            "Droit des sociétés",
                            "Droit du travail",
                            "Procédure civile"
                        ]
                    }
                ],
                "master_programs": [
                    {
                        "name": "Droit des Affaires et de l'Entreprise",
                        "duration": "2 ans"
                    }
                ]
            },
            "SCIENCE_POLITIQUE": {
                "name": "Science Politique",
                "license_programs": [
                    {
                        "level": "Licence 3",
                        "name": "Science Politique",
                        "ue": [
                            "Théorie politique",
                            "Politique comparée",
                            "Relations internationales",
                            "Sociologie politique",
                            "Histoire politique"
                        ]
                    }
                ],
                "master_programs": [
                    {
                        "name": "Sciences Politique",
                        "duration": "2 ans"
                    }
                ]
            },
            "ENGLISH_LAW": {
                "name": "English Law",
                "license_programs": [
                    {
                        "level": "Licence 3",
                        "name": "English Law",
                        "ue": [
                            "Constitutional Law",
                            "Contract Law",
                            "Criminal Law",
                            "Tort Law",
                            "Legal Writing"
                        ]
                    }
                ],
                "master_programs": [
                    {
                        "name": "English Law",
                        "duration": "2 ans"
                    }
                ]
            }
        }
    },
    "FALSH": {
        "name": "Faculté des Arts, Lettres et Sciences Humaines",
        "departments": {
            "GEOGRAPHIE": {
                "name": "Géographie et Géomatique",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Géographie et Géomatique",
                        "ue": [
                            "Géographie physique",
                            "Géographie humaine",
                            "Cartographie",
                            "SIG (Systèmes d'Information Géographique)",
                            "Climatologie"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Géographie et Géomatique",
                        "ue": [
                            "Géomorphologie",
                            "Géographie urbaine",
                            "Télédétection",
                            "Analyse spatiale",
                            "Géographie régionale"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Géographie et Géomatique",
                        "ue": [
                            "Géomatique avancée",
                            "Aménagement du territoire",
                            "Environnement et développement durable",
                            "Géographie économique",
                            "Méthodologie de recherche"
                        ]
                    }
                ]
            },
            "HISTOIRE": {
                "name": "Histoire",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Histoire",
                        "ue": [
                            "Histoire ancienne",
                            "Histoire médiévale",
                            "Méthodologie historique",
                            "Introduction aux sciences humaines",
                            "Paléographie"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Histoire",
                        "ue": [
                            "Histoire moderne",
                            "Histoire contemporaine",
                            "Histoire de l'Afrique",
                            "Histoire économique et sociale",
                            "Archivistique"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Histoire Politique",
                        "ue": [
                            "Histoire politique",
                            "Histoire des civilisations",
                            "Histoire des religions",
                            "Muséologie",
                            "Projet de recherche"
                        ]
                    }
                ]
            },
            "LANGUES_ETRANGERES": {
                "name": "Langues Étrangères Appliquées",
                "programs": ["Allemand", "Chinois", "Russe", "Arabe", "Espagnol"],
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Langues Étrangères Appliquées",
                        "ue": [
                            "Langue 1 - Niveau débutant",
                            "Langue 2 - Niveau débutant",
                            "Civilisation",
                            "Traduction initiation",
                            "Communication interculturelle"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Langues Étrangères Appliquées",
                        "ue": [
                            "Langue 1 - Niveau intermédiaire",
                            "Langue 2 - Niveau intermédiaire",
                            "Traduction spécialisée",
                            "Interprétation",
                            "Commerce international"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Langues Étrangères Appliquées",
                        "ue": [
                            "Langue 1 - Niveau avancé",
                            "Langue 2 - Niveau avancé",
                            "Traduction technique",
                            "Interprétation simultanée",
                            "Marketing international"
                        ]
                    }
                ]
            },
            "ENGLISH_CREATIVE_WRITING": {
                "name": "English and Creative Writing",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Linguistique Anglaise",
                        "ue": [
                            "English Grammar",
                            "Phonetics and Phonology",
                            "English Literature Introduction",
                            "Creative Writing Basics",
                            "English for Communication"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Linguistique Anglaise",
                        "ue": [
                            "Syntax and Semantics",
                            "British Literature",
                            "American Literature",
                            "Advanced Creative Writing",
                            "Translation Studies"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Linguistique Anglaise",
                        "ue": [
                            "Sociolinguistics",
                            "Contemporary English Literature",
                            "Editing and Publishing",
                            "Professional Writing",
                            "Research Project"
                        ]
                    }
                ]
            },
            "FRANCAIS": {
                "name": "Français et Entrepreneuriat du Livre",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Lettres Modernes Françaises",
                        "ue": [
                            "Littérature française",
                            "Langue française",
                            "Culture générale",
                            "Grammaire française",
                            "Expression écrite"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Lettres Modernes Françaises",
                        "ue": [
                            "Littérature comparée",
                            "Linguistique française",
                            "Rhétorique",
                            "Critique littéraire",
                            "Édition"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Lettres Modernes Françaises",
                        "ue": [
                            "Littérature contemporaine",
                            "Entrepreneuriat du livre",
                            "Poésie et dramaturgie",
                            "Journalisme",
                            "Projet professionnel"
                        ]
                    }
                ]
            }
        }
    },
    "FS": {
        "name": "Faculté des Sciences",
        "departments": {
            "ENERGIES_RENOUVELABLES": {
                "name": "Énergies Renouvelables",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Énergies Renouvelables",
                        "ue": [
                            "Physique générale",
                            "Mathématiques pour ingénieurs",
                            "Chimie générale",
                            "Introduction aux énergies renouvelables",
                            "Électricité"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Énergies Renouvelables",
                        "ue": [
                            "Thermodynamique",
                            "Énergie solaire",
                            "Énergie éolienne",
                            "Biomasse",
                            "Efficacité énergétique"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Efficacité Énergétique et énergies Renouvelables",
                        "ue": [
                            "Production d'énergie hydroélectrique",
                            "Thermique énergétique",
                            "Gestion des énergies renouvelables",
                            "Environnement et développement durable",
                            "Projet professionnel"
                        ]
                    }
                ],
                "master_programs": [
                    "Master en Géotechnique, Géo-patrimoine",
                    "Master en Production et Gestion des Énergies Renouvelables",
                    "Master en Biomasse et Bioénergie Production d'Énergie Hydroélectrique"
                ]
            },
            "PHYSIQUE_GEOSCIENCES": {
                "name": "Physique et Géosciences",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Physique et Géosciences",
                        "ue": [
                            "Physique générale",
                            "Mathématiques",
                            "Géologie générale",
                            "Chimie",
                            "Informatique"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Physique et Géosciences",
                        "ue": [
                            "Mécanique",
                            "Géophysique",
                            "Minéralogie",
                            "Pétrologie",
                            "Instrumentation"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Physique et Géosciences",
                        "ue": [
                            "Géotechnique et Hydro-technique",
                            "Géodynamique",
                            "Biophysique et mesures",
                            "Environnement et Agro-pédologie",
                            "Mécanique et systèmes complexes"
                        ]
                    }
                ],
                "master_programs": [
                    "Master en Réservoirs, Sols et Environnement (RSE)",
                    "Master en Géologie Structurale",
                    "Master en Géotechnique",
                    "Master en Hydrologie-Hydrologie",
                    "Master en Géophysique",
                    "Master en Magmatologie"
                ]
            },
            "CHIMIE": {
                "name": "Chimie",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Chimie",
                        "ue": [
                            "Chimie générale",
                            "Mathématiques",
                            "Physique",
                            "Biologie",
                            "Structure de la matière"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Chimie",
                        "ue": [
                            "Chimie organique",
                            "Chimie inorganique",
                            "Chimie physique",
                            "Chimie analytique",
                            "Thermodynamique chimique"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Chimie",
                        "ue": [
                            "Chimie organique avancée",
                            "Chimie appliquée",
                            "Biochimie",
                            "Analyse instrumentale",
                            "Projet de recherche"
                        ]
                    }
                ],
                "master_programs": [
                    "Master en Chimie des molécules bio-actives, Analyse et assurance qualité et Polymères fonctionnels",
                    "Sciences et Technologie de l'Agriculture, de l'Alimentation et de l'Environnement",
                    "Master en Ingénierie biologique pour l'environnement",
                    "Master en Management de l'environnement des collectivités et des entreprises"
                ]
            },
            "BIOLOGIE": {
                "name": "Biologie",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Biologie",
                        "ue": [
                            "Biologie cellulaire",
                            "Botanique",
                            "Zoologie",
                            "Chimie organique",
                            "Génétique"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Biologie",
                        "ue": [
                            "Biologie animale",
                            "Biologie végétale",
                            "Physiologie",
                            "Écologie",
                            "Biochimie"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Biologie",
                        "ue": [
                            "Biologie animale avancée",
                            "Biologie végétale avancée",
                            "Biotechnologie",
                            "Microbiologie",
                            "Projet de recherche"
                        ]
                    }
                ]
            },
            "MATHEMATIQUES": {
                "name": "Mathématiques",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Mathématiques Fondamentales (MAF)",
                        "ue": [
                            "Analyse mathématique",
                            "Algèbre linéaire",
                            "Géométrie",
                            "Probabilités",
                            "Informatique"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Mathématiques Fondamentales (MAF)",
                        "ue": [
                            "Analyse complexe",
                            "Algèbre abstraite",
                            "Topologie",
                            "Statistiques",
                            "Programmation"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Mathématiques Fondamentales (MAF)",
                        "ue": [
                            "Analyse fonctionnelle",
                            "Théorie des nombres",
                            "Équations différentielles",
                            "Cryptographie",
                            "Projet de recherche"
                        ]
                    }
                ],
                "career_options": [
                    "Sécurité et réseaux",
                    "Logiciels et calculs",
                    "Robotique et intelligence artificielle",
                    "Conseil finance et assurance",
                    "Environnement"
                ]
            },
            "STATISTIQUES": {
                "name": "Statistiques",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Mathématiques, Statistiques et Informatique (MSI)",
                        "ue": [
                            "Mathématiques",
                            "Statistiques descriptives",
                            "Probabilités",
                            "Informatique générale",
                            "Algorithmique"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Mathématiques, Statistiques et Informatique (MSI)",
                        "ue": [
                            "Statistiques inférentielles",
                            "Analyse de données",
                            "Bases de données",
                            "Recherche opérationnelle",
                            "Programmation statistique"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Mathématiques, Statistiques et Informatique (MSI)",
                        "ue": [
                            "Statistiques avancées",
                            "Data mining",
                            "Machine learning",
                            "Big data",
                            "Projet professionnel"
                        ]
                    }
                ]
            },
            "INFORMATIQUE": {
                "name": "Informatique",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Informatique Fondamentale (INF)",
                        "ue": [
                            "Algorithmique",
                            "Programmation",
                            "Architecture des ordinateurs",
                            "Mathématiques pour l'informatique",
                            "Systèmes d'exploitation"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Informatique Fondamentale (INF)",
                        "ue": [
                            "Structures de données",
                            "Bases de données",
                            "Réseaux informatiques",
                            "Programmation orientée objet",
                            "Génie logiciel"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Informatique Fondamentale (INF)",
                        "ue": [
                            "Sécurité et réseaux",
                            "Développement web",
                            "Intelligence artificielle",
                            "Robotique",
                            "Projet de fin d'études"
                        ]
                    }
                ]
            },
            "SCIENCES_BIOMEDICALES": {
                "name": "Sciences Biomédicales",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Sciences Biomédicales",
                        "ue": [
                            "Biologie cellulaire",
                            "Anatomie",
                            "Biochimie",
                            "Chimie médicale",
                            "Microbiologie générale"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Sciences Biomédicales",
                        "ue": [
                            "Parasitologie",
                            "Bactériologie",
                            "Virologie",
                            "Immunologie",
                            "Hématologie"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Sciences Biomédicales",
                        "ue": [
                            "Techniques d'analyses biomédicales",
                            "Microbiologie médicale",
                            "Biochimie clinique",
                            "Parasitologie médicale",
                            "Stage professionnel"
                        ]
                    }
                ]
            }
        }
    },
    "FSEG": {
        "name": "Faculté des Sciences Économiques et de Gestion",
        "departments": {
            "BANQUE_FINANCE_ASSURANCES": {
                "name": "Banque, Finance et Assurances",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Sciences économiques et de Gestion",
                        "ue": [
                            "Introduction à l'économie",
                            "Mathématiques financières",
                            "Comptabilité générale",
                            "Gestion d'entreprise",
                            "Statistiques"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Sciences économiques et de Gestion",
                        "ue": [
                            "Macroéconomie",
                            "Microéconomie",
                            "Finance d'entreprise",
                            "Comptabilité analytique",
                            "Économétrie"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Banque, Finance et Assurances",
                        "ue": [
                            "Gestion bancaire",
                            "Marchés financiers",
                            "Assurances",
                            "Analyse financière",
                            "Gestion de portefeuille"
                        ]
                    }
                ],
                "master_programs": [
                    "Master en Banque",
                    "Master en Management de la santé"
                ]
            },
            "COMPTABILITE_CONTROLE_AUDIT": {
                "name": "Comptabilité, Contrôle, Audit",
                "license_programs": [
                    {
                        "level": "Licence 1",
                        "name": "Sciences économiques et de Gestion",
                        "ue": [
                            "Introduction à l'économie",
                            "Mathématiques financières",
                            "Comptabilité générale",
                            "Gestion d'entreprise",
                            "Statistiques"
                        ]
                    },
                    {
                        "level": "Licence 2",
                        "name": "Sciences économiques et de Gestion",
                        "ue": [
                            "Comptabilité des sociétés",
                            "Droit des affaires",
                            "Fiscalité",
                            "Gestion financière",
                            "Contrôle de gestion"
                        ]
                    },
                    {
                        "level": "Licence 3",
                        "name": "Comptabilité, Contrôle, Audit",
                        "ue": [
                            "Comptabilité approfondie",
                            "Audit et contrôle",
                            "Consolidation",
                            "Normes comptables internationales",
                            "Système d'information comptable"
                        ]
                    }
                ]
            }
        }
    },
    "ENS": {
        "name": "École Normale Supérieure",
        "programs": {
            "DIPES": {
                "name": "DIPES I & II",
                "disciplines": [
                    "Physique",
                    "Mathématiques",
                    "Informatique Fondamentale",
                    "Informatique Option TIC",
                    "Chimie",
                    "Sciences de la Vie",
                    "Sciences de la terre et de l'Environnement",
                    "Géographie",
                    "Histoire",
                    "Allemand",
                    "Espagnol",
                    "Lettres Bilingues",
                    "Arabe",
                    "Chinois",
                    "Lettres modernes Anglaises",
                    "Lettres modernes Françaises",
                    "Langues et cultures Camerounaises",
                    "Techniques des Langages Spécialisés"
                ],
                "duration": "3 ans (Licence) ou 2 ans (Master)",
                "admission": "Concours requis pour les candidats réguliers, non requis pour les auditeurs libres"
            },
            "DIPEN": {
                "name": "DIPEN I & II",
                "specializations": [
                    "Sciences de l'Éducation OPTION professeur Enseignement Normal",
                    "Sciences de l'Éducation"
                ],
                "admission": "Licence en Sciences de l'Éducation, Diplôme de l'Eniet, Enieg ou équivalent"
            },
            "DIPCO": {
                "name": "DIPCO",
                "specialization": "Conseillers Principal d'Orientation"
            }
        }
    },
    "ESTM": {
        "name": "École Supérieure de Transformation des Mines et des Ressources Énergétiques",
        "departments": {
            "GENIE_MINIER": {
                "name": "Génie Minier et Géologique (GMC)",
                "programs": [
                    {
                        "name": "Exploration Minière",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    },
                    {
                        "name": "Mines",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    },
                    {
                        "name": "Topographie Minière",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    }
                ]
            },
            "GENIE_MATERIAUX": {
                "name": "Génie des Matériaux et Valorisation des Ressources (GMR)",
                "programs": [
                    {
                        "name": "Sciences des pierres précieuses",
                        "duration": "5 ans",
                        "career": "Gemmologue"
                    }
                ]
            },
            "ECONOMIE_ADMINISTRATION_MINIERE": {
                "name": "Économie et Administration Minière (EAM)",
                "programs": [
                    {
                        "name": "Économie Minière",
                        "duration": "5 ans"
                    },
                    {
                        "name": "Administration des entreprises minières",
                        "duration": "5 ans"
                    },
                    {
                        "name": "Comptabilité des entreprises minières",
                        "duration": "5 ans"
                    }
                ]
            }
        }
    },
    "ISABEE": {
        "name": "Institut Supérieur d'Agriculture, du Bois, de l'eau, et de l'environnement",
        "departments": {
            "AGRICULTURE": {
                "name": "Agriculture - Elevage - Aquaculture",
                "programs": [
                    {
                        "name": "Agroéconomie",
                        "duration": "3 ans (Licence) / 2 ans (Master)"
                    },
                    {
                        "name": "Aquaculture",
                        "duration": "3 ans (Licence) / 2 ans (Master)"
                    },
                    {
                        "name": "Production Animale",
                        "duration": "3 ans (Licence) / 2 ans (Master)"
                    },
                    {
                        "name": "Production Végétale",
                        "duration": "3 ans (Licence) / 2 ans (Master)"
                    }
                ],
                "master_programs": [
                    "Masters en gouvernance forestière, agribusiness"
                ]
            },
            "TRANSFORMATION": {
                "name": "Transformation Poussée des produits agricoles et produits Forestiers non ligneux (PFL)",
                "programs": [
                    "Produits Alimentaires Améliorés",
                    "Médicaments traditionnels Améliorés",
                    "Produit de Service Améliorés"
                ]
            },
            "FORETS_BOIS": {
                "name": "Forêts et Bois",
                "programs": [
                    "Aménagement forestier",
                    "Exploitation forestière",
                    "Gestion des opérations Forestières"
                ]
            },
            "PISCICULTURE": {
                "name": "Pisciculture",
                "programs": [
                    "Pisciculture et pêche"
                ]
            },
            "SCIENCES_EAU": {
                "name": "Sciences de l'eau",
                "programs": [
                    "Assainissement et production eau potable"
                ]
            },
            "ENVIRONNEMENT": {
                "name": "Environnement",
                "programs": [
                    "Changement Climatique",
                    "Hygiène et sécurité Environnement"
                ]
            }
        }
    },
    "ESSUT": {
        "name": "École Supérieure des Sciences de l'Urbanisme et du Tourisme",
        "departments": {
            "GENIE_URBAIN": {
                "name": "Génie Urbain (GUR)",
                "programs": [
                    {
                        "name": "Génie Urbain",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    },
                    {
                        "name": "Architecture Urbaine",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    },
                    {
                        "name": "Assainissement Urbain",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    }
                ],
                "master_programs": [
                    "Masters spécialisés en urbanisme, tourisme"
                ]
            },
            "AMENAGEMENT_URBAIN": {
                "name": "Aménagement Urbain (AUR)",
                "programs": [
                    {
                        "name": "Urbanisme",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    },
                    {
                        "name": "Aménagement des sites touristiques",
                        "duration": "5 ans",
                        "degree": "Ingénieur"
                    }
                ]
            },
            "TOURISME_HOTELLERIE": {
                "name": "Tourisme et Hôtellerie",
                "license_programs": [
                    {
                        "level": "Licence Professionnelle",
                        "name": "Management Touristique",
                        "duration": "3 ans"
                    },
                    {
                        "level": "Licence Professionnelle",
                        "name": "Gestion et Management Hôtelier",
                        "duration": "3 ans"
                    },
                    {
                        "level": "Licence Professionnelle",
                        "name": "Commercialisation et Services de restauration",
                        "duration": "3 ans"
                    }
                ],
                "careers": [
                    "Responsables d'agence touristique",
                    "Hôte, Hôtesse d'accueil",
                    "Responsable des services d'hôtellerie",
                    "Maître d'hôtel"
                ]
            }
        }
    }
}


def get_establishments():
    """Retourne la liste des établissements"""
    return [
        {"id": key, "name": value["name"]}
        for key, value in UBERTOUA_DATA.items()
    ]


def get_departments(establishment_id):
    """Retourne les départements d'un établissement"""
    if establishment_id not in UBERTOUA_DATA:
        return []

    establishment = UBERTOUA_DATA[establishment_id]

    if "departments" in establishment:
        return [
            {"id": key, "name": value["name"]}
            for key, value in establishment["departments"].items()
        ]
    elif "programs" in establishment:
        return [
            {"id": establishment_id, "name": establishment["name"]}
        ]

    return []


def get_programs(establishment_id, department_id, level):
    """Retourne les programmes/filières d'un département pour un niveau donné"""
    if establishment_id not in UBERTOUA_DATA:
        return []

    establishment = UBERTOUA_DATA[establishment_id]

    if "departments" not in establishment:
        return []

    if department_id not in establishment["departments"]:
        return []

    department = establishment["departments"][department_id]

    if "license_programs" not in department:
        return []

    # Filtrer par niveau (Licence 1, 2, 3, Master 1, 2)
    programs = []
    for program in department["license_programs"]:
        if program.get("level") == level:
            programs.append(program)

    return programs


def get_ue_for_program(establishment_id, department_id, level):
    """Retourne les UE pour un programme donné"""
    programs = get_programs(establishment_id, department_id, level)

    if not programs:
        return []

    # Retourner les UE du premier programme trouvé
    return programs[0].get("ue", [])
