import xml.etree.ElementTree as ET

ET.register_namespace("", "http://www.w3.org/ns/ttml")

tree = ET.parse('ttml_base.xml')
root = tree.getroot()



# TTML_BASE = """
# <tt xml:lang="" xmlns="http://www.w3.org/ns/ttml">
#   <head>
#     <metadata/>
#     <styling/>
#     <layout/>
#   </head>
#   <body/>
# </tt>
# """

# root = ET.fromstring(TTML_BASE)


tt = lambda x: "{http://www.w3.org/ns/ttml}" + x


ET.Element(root)
# print(root.children)


body = root.find(tt("body"))
print(body)
body_div = ET.SubElement(body, 'div')
print(body_div)

p1 = ET.Element('p', attrib={"xml:id":"subtitle3","begin":"10.0s","end":"16.0s","style":"s2"})
p1.text = "안녕하세요"

# p1 = ET.SubElement(body_div, )
body_div.append(p1)


ET.dump(root)
# for child in root:
#     print(child.tag, child.attrib)
#     for cchild in child:
#         print(cchild.tag)
#         for c in cchild:
#             print(c.tag, c.attrib)
    # print(child.__dir__())

# print(root[tt("body")])

"""
<p xml:id="subtitle3" begin="10.0s" end="16.0s" style="s2">
    It is puzzling, why is it<br/>
    we do not see things upside-down?
</p>
"""
tree.write("Aa.xml")