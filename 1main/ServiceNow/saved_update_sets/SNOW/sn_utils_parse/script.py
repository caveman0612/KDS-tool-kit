# // View data - SN Utils
import os

# $ , / ? % # [ ]




convert = {
    " ":  "%20",
    "=":  "%3D",
    "(":  "%28",
    '"':  "%22",
    ")":  "%29",
    ";":  "%3B",
    "\n":  "%0A",
    "{":  "%7B",
    "}":  "%7D",
    "'":  "%27",
    "+":  "%2b",
    "!":  "%21",
    "*":  "%2a",
    ":":  "%3a",
    "@":  "%40",
    "&":  "%26",
    ",":  "%2c",
    "/":  "%2f",
    "?":  "%3f",
    "#":  "%23",
    "[":  "%5b",
    "]":  "%5d",
}

url = "/sys.scripts.do?content="

print("--------------start----------------------")
print()
dn = os.path.abspath(".1general/notes/SNOW/sn_utils_parse/script.js")

with open(dn, 'r') as f2:
    lines = f2.readlines()
    for line in lines:
        for item in line:
            if item in convert:
                url += convert[item]
            else:
                url += item
        # url += "%0A"

dn = os.path.abspath(".1general/notes/SNOW/sn_utils_parse/string.txt")

with open(dn, 'w') as f3:
    f3.write(url)

print(url)

print()
print("-------------end---------------")
