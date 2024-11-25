import xml.etree.ElementTree as ET
import csv
import re

def extract_numeric_code(code_str):
    if not code_str:
        return 0
    # Extract first number found in the string
    match = re.search(r'(\d+)', str(code_str))
    if match:
        return int(match.group(1))
    return 0

def process_courses_xml(input_file, output_file):
    try:
        # Parse cleaned XML
        tree = ET.parse(input_file)
        root = tree.getroot()
        
        # Open CSV file for writing
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            # Write header
            writer.writerow(['codigo', 'curso', 'grau'])
            
            # Process each curso element
            seen_rows = set()
            for curso in root.findall('.//curso'):
                try:
                    codigo_elem = curso.find('codigo')
                    nome_elem = curso.find('nome')
                    grau_elem = curso.find('grau')
                    
                    if codigo_elem is not None and nome_elem is not None and grau_elem is not None:
                        codigo = codigo_elem.text
                        numeric_code = extract_numeric_code(codigo)
                        
                        # Check if code is between 8000 and 9999
                        if 8000 < numeric_code < 9999:
                            nome = nome_elem.text
                            grau = grau_elem.text
                            
                            # Create a tuple for the row
                            row = (numeric_code, nome, grau)
                            
                            # Check if the row is already seen
                            if row not in seen_rows:
                                # Write to CSV
                                writer.writerow(row)
                                # Add the row to the seen set
                                seen_rows.add(row)
                except Exception as e:
                    print(f"Erro ao processar um curso: {e}")
                    continue
                    
        print(f"Arquivo CSV criado com sucesso: {output_file}")
        
    except ET.ParseError as e:
        print(f"Erro ao fazer parse do XML: {e}")
    except Exception as e:
        print(f"Erro inesperado: {e}")

# Uso do script
process_courses_xml('codigosNomesGraus.xml', 'cursocod-nome-grau.csv')